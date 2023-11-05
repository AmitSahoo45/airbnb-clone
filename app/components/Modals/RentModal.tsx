'use client';

import React, { useCallback, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { Inputs, CategoryInput } from "../Inputs";
import { categories } from "../Navbar/Categories/Categories";
import CountrySelect from "../Inputs/CountrySelect";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Inputs";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        }
    });

    const rentmodal = useRentModal();
    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    } // -- > Assigning onclick to the setvalue does not work. In react form hook set value does set the value but it does not re render the page. So we need to use the setCustomValue function to re render the page.

    const onBack = () => setStep((value) => value - 1);
    const onNext = () => setStep((value) => value + 1);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) return onNext();
        setIsLoading(true);

        toast.promise(
            axios.post('/api/listings', data)
                .finally(() => {
                    setIsLoading(false);
                }), {
            loading: 'Creating listing...',
            success: () => {
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY)
                rentmodal.onClose();
                return 'Listing created!'
            },
            error: () => {
                return 'Something went wrong.'
            }
        })
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) return 'Create'

        return 'Next'
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) return undefined

        return 'Back'
    }, [step]);

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Where is your place located?"
                    subtitle="Help guests find you!"
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map center={location?.latlng} />
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amenitis do you have?"
                />
                <Counter
                    onChange={(value) => setCustomValue('guestCount', value)}
                    value={guestCount}
                    title="Guests"
                    subtitle="How many guests do you allow?"
                />
                <hr />
                <Counter
                    onChange={(value) => setCustomValue('roomCount', value)}
                    value={roomCount}
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                />
                <hr />
                <Counter
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                    value={bathroomCount}
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe your place?"
                    subtitle="Short and sweet works best!"
                />
                <Input
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Now, set your price"
                    subtitle="How much do you charge per night?"
                />
                <Input
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return (
        <Modal
            title="Rent a Room"
            isOpen={rentmodal.isOpen}
            onClose={rentmodal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default RentModal