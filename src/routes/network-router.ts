import { Router } from "express"
import { networksController } from "@/controllers"
import { validateSchemas, authentication } from "@/middlewares"

const networksRouter = Router()

networksRouter.post('/networks', validateSchemas("network"), authentication, networksController.createNetwork)
networksRouter.get('/networks', authentication, networksController.listUserNetworks)
networksRouter.get('/networks/:id', authentication, networksController.listUserNetworksById)
networksRouter.delete('/networks/:id', authentication, networksController.deleteNetwork)

export default networksRouter