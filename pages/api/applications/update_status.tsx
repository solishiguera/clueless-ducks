import { NextApiRequest, NextApiResponse } from "next";
import { updateStatus } from "../../../services/applications";
import { getSession } from "next-auth/react";
import SessionDTO from "../../../lib/dto/session";

export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Getting the information of the user session
    const session = new SessionDTO(await getSession({ req }));

    // Checking for the existence of a Master or Admin session
    if (!session || session.role == "USER") {
        return res.status(401).json({ error: "Authorization Required" });
    }

    // Comprobation of the method
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Obtaining variables from request
    const { application_id, status } = req.body;

    // Errors managment
    if (application_id && status) {
        try {
            // Database query.
            const jobOffer = await updateStatus(application_id, status)

            res.status(200);
            res.json(jobOffer);

        } catch (e) {
            res.status(500);
            res.json({ error: "Unable to create job Offer" });
            console.log(e);

        }
    } else {
        res.status(400).json({ error: "Server did not understand the request due to invalid syntax" });
    }
}