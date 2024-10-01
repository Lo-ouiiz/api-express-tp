import { Router } from "express";
import { Actor } from "..";
// import { checkToken } from "../middlewares/checkToken";

export const actorRouter = Router();

actorRouter.get("/", async (req, res) => {
    const actor = await Actor.findAll();
    res.json(actor);
});

actorRouter.get("/:id", async (req, res) => {
    const actor = await Actor.findOne({ where: { id: req.params.id } });
    if (actor) {
        res.json(actor);
    }
    else {
        res.status(404).send("Actor not found");
    }
});

actorRouter.post("/", async (req, res) => {
    const { name } = req.body.data;
    if(!name){
        res.status(400).send("Missing required information");
    }
    else {
        const newActor = await Actor.create({ name });
        res.json(newActor);
    }
});

actorRouter.put("/:id", async (req, res) => {
    const { name } = req.body.data;
    const actual = await Actor.findOne({ where: { id: req.params.id } });
    if (actual) {
        const newActor = await actual.update({ name });
        res.json(actual);
    }
    else {
        res.status(404).send("Actor not found");
    }
});

actorRouter.delete("/:id", async (req, res) => {
    const actual = await Actor.findOne({ where: { id: req.params.id } });
    if (actual) {
        await actual.destroy();
        res.send("deleted");
    }
    else {
        res.status(404).send("Actor not found");
    }
});