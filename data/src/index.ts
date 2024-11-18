import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { port } from "./config"
import * as morgan from "morgan";

// currently on https://www.youtube.com/watch?v=rflZhPzr_G4
// BUG: "null value in column \"firstName\" of relation \"user\" violates not-null constraint" when trying to POST a test case

function handleError(err, req, res, next) {
    res.status(err.statusCode || 500).send({ message: err.message } )
}

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(morgan('tiny'))
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
            try {
                const result = await (new (route.controller as any))[route.action](req, res, next)
                res.json(result)
            } catch (error) {
                next(error)
            }
            
        })
    })

    app.use(handleError)
    app.listen(port)

    console.log(`Express server has started on port ${port}.`)

}).catch(error => console.log(error))
