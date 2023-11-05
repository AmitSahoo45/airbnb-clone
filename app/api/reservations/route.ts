import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from '../../actions/currentuser'

export async function POST(
    request: Request,
) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.error();

    console.log('Im In')

    const body = await request.json();
    const {
        listingId,
        startDate,
        endDate,
        totalPrice
    } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
        return NextResponse.error();
    }

    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice,
                }
            }
        }
    });

    return NextResponse.json(listingAndReservation);
}