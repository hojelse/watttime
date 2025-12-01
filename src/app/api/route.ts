import { getData } from "./get_data"

export const GET = async () => Response.json(await getData())

