import { AlertBlock } from "@/components/shared/alert-block";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addResourcesRedis = z.object({
	memoryReservation: z.number().nullable().optional(),
	cpuLimit: z.number().nullable().optional(),
	memoryLimit: z.number().nullable().optional(),
	cpuReservation: z.number().nullable().optional(),
});
interface Props {
	redisId: string;
}

type AddResourcesRedis = z.infer<typeof addResourcesRedis>;
export const ShowRedisResources = ({ redisId }: Props) => {
	const { data, refetch } = api.redis.one.useQuery(
		{
			redisId,
		},
		{ enabled: !!redisId },
	);
	const { mutateAsync, isLoading } = api.redis.update.useMutation();
	const form = useForm<AddResourcesRedis>({
		defaultValues: {},
		resolver: zodResolver(addResourcesRedis),
	});

	useEffect(() => {
		if (data) {
			form.reset({
				cpuLimit: data?.cpuLimit || undefined,
				cpuReservation: data?.cpuReservation || undefined,
				memoryLimit: data?.memoryLimit || undefined,
				memoryReservation: data?.memoryReservation || undefined,
			});
		}
	}, [data, form, form.formState.isSubmitSuccessful, form.reset]);

	const onSubmit = async (formData: AddResourcesRedis) => {
		await mutateAsync({
			redisId,
			cpuLimit: formData.cpuLimit || null,
			cpuReservation: formData.cpuReservation || null,
			memoryLimit: formData.memoryLimit || null,
			memoryReservation: formData.memoryReservation || null,
		})
			.then(async () => {
				toast.success("Resources Updated");
				await refetch();
			})
			.catch(() => {
				toast.error("Error to Update the resources");
			});
	};
	return (
		<Card className="bg-background">
			<CardHeader>
				<CardTitle className="text-xl">Resources</CardTitle>
				<CardDescription>
					If you want to decrease or increase the resources to a specific.
					application or database
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<AlertBlock type="info">
					Please remember to click Redeploy after modify the resources to apply
					the changes.
				</AlertBlock>
				<Form {...form}>
					<form
						id="hook-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-8 "
					>
						<div className="grid w-full md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="memoryReservation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Memory Reservation</FormLabel>
										<FormControl>
											<Input
												placeholder="256 MB"
												{...field}
												value={field.value?.toString() || ""}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														// Si el campo está vacío, establece el valor como null.
														field.onChange(null);
													} else {
														const number = Number.parseInt(value, 10);
														if (!Number.isNaN(number)) {
															// Solo actualiza el valor si se convierte a un número válido.
															field.onChange(number);
														}
													}
												}}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="memoryLimit"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Memory Limit</FormLabel>
											<FormControl>
												<Input
													placeholder={"1024 MB"}
													{...field}
													value={field.value?.toString() || ""}
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") {
															// Si el campo está vacío, establece el valor como null.
															field.onChange(null);
														} else {
															const number = Number.parseInt(value, 10);
															if (!Number.isNaN(number)) {
																// Solo actualiza el valor si se convierte a un número válido.
																field.onChange(number);
															}
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<FormField
								control={form.control}
								name="cpuLimit"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Cpu Limit</FormLabel>
											<FormControl>
												<Input
													placeholder={"2"}
													{...field}
													value={field.value?.toString() || ""}
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") {
															// Si el campo está vacío, establece el valor como null.
															field.onChange(null);
														} else {
															const number = Number.parseInt(value, 10);
															if (!Number.isNaN(number)) {
																// Solo actualiza el valor si se convierte a un número válido.
																field.onChange(number);
															}
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="cpuReservation"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Cpu Reservation</FormLabel>
											<FormControl>
												<Input
													placeholder={"1"}
													{...field}
													value={field.value?.toString() || ""}
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") {
															// Si el campo está vacío, establece el valor como null.
															field.onChange(null);
														} else {
															const number = Number.parseInt(value, 10);
															if (!Number.isNaN(number)) {
																// Solo actualiza el valor si se convierte a un número válido.
																field.onChange(number);
															}
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
						<div className="flex w-full justify-end">
							<Button isLoading={isLoading} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
