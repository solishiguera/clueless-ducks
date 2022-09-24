import { NextApiRequest, NextApiResponse } from "next";
import { updateExperience } from "../../../services/experience";
import { getSession } from "next-auth/react";
import SessionDTO from "../../../lib/dto/session";

export default async function (req: NextApiRequest, res: NextApiResponse) {

    // Getting the information of the user session
    const session = new SessionDTO(await getSession({ req }));

    // Checking for the existence of a session
    if (!session) {
        return res.status(401).json({ error: "Authorization Required" });
    }

    // Comprobation of the method
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { user_id, experience_id, type, description, name, start_date, end_date } = req.body;

    // Errors managment
    if (user_id && experience_id && type && description && name && start_date && end_date) {

        // Checking if the user_id sented corresponds to the session
        if (session.id != user_id) {
            return res.status(401).json({ error: "Session id mismatch" });
        }

        try {
            // Calling service to update a experience
            const updated_experience = await updateExperience(experience_id, type, description, name, start_date, end_date)

            res.status(200);
            res.json(updated_experience);

        } catch (e) {
            res.status(500);
            res.json({ error: "Unable to update experience with experience_id: " + experience_id.toString() });
            console.log(e);

        }
    } else {
        res.status(400).json({ error: "Server did not understand the request due to invalid syntax" });
    }
}