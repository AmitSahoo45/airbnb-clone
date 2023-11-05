import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from './ListingClient'

import getListingById from "@/app/actions/getListingById";
import getCurrentUser from "@/app/actions/currentuser";
import getReservations from "@/app/actions/getReservation";

interface IParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
    const listing = await getListingById(params);
    const reservations = await getReservations(params);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState showReset />
            </ClientOnly>
        )
    }

    return (
        <div>
            <ClientOnly>
                <ListingClient
                    listing={listing}
                    currentUser={currentUser}
                    reservations={reservations}
                />
            </ClientOnly>
        </div>
    )
}

export default ListingPage;