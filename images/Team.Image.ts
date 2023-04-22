import {AttachmentBuilder} from "discord.js";
import * as Canvas from "canvas";
import Team from "../Team";

export default class TeamImage {
    public static async build(team: Team): Promise<AttachmentBuilder> {

        const canvas = Canvas.createCanvas(2560, 1440);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage("./media/Leaderboard.png");

        return new AttachmentBuilder(canvas.toBuffer(), {name: 'leaderboard.png'});
    }
}