import { Router } from "express";
import { Movie } from "..";
// import { checkToken } from "../middlewares/checkToken";

export const movieRouter = Router();

movieRouter.get("/", async (req, res) => {
    const movie = await Movie.findAll();
    res.json(movie);
});

movieRouter.get("/:id", async (req, res) => {
    const movie = await Movie.findOne({ where: { id: req.params.id } });
    if (movie) {
        res.json(movie);
    }
    else {
        res.status(404).send("Movie not found");
    }
});

movieRouter.post("/", async (req, res) => {
    const { name, description, date, director } = req.body.data;
    if(!name || !description || !date || !director){
        res.status(400).send("Missing required information");
    }
    else {
        const newMovie = await Movie.create({ name, description, date, director });
        res.json(newMovie);
    }
});

movieRouter.put("/:id", async (req, res) => {
    const { name, description, date, director } = req.body.data;
    const actual = await Movie.findOne({ where: { id: req.params.id } });
    if (actual) {
        const newMovie = await actual.update({ name, description, date, director });
        res.json(actual);
    }
    else {
        res.status(404).send("Movie not found");
    }
});

movieRouter.delete("/:id", async (req, res) => {
    const actual = await Movie.findOne({ where: { id: req.params.id } });
    if (actual) {
        await actual.destroy();
        res.send("deleted");
    }
    else {
        res.status(404).send("Movie not found");
    }
});