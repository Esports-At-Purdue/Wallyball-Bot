import { CanvasRenderingContext2D, Image } from "canvas";

export default class ImageUtils {
    public static printText
    (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, font: string, alignment: CanvasTextAlign) {
        ctx.fillStyle = color;
        ctx.textAlign = alignment;
        ctx.font = font;
        ctx.fillText(text, x, y);
        ctx.save();
    }

    public static printImage
    (ctx: CanvasRenderingContext2D, image: Image, x: number, y: number, width: number, height: number) {
        ctx.drawImage(image, x, y, width, height);
        ctx.restore();
        ctx.save();
    }

    public static printAvatar(ctx: CanvasRenderingContext2D, avatar: Image, x, y, d) {
        ctx.beginPath();
        ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2, true);
        ctx.fillStyle = "#ffffff";
        ctx.clip();
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + d / 2, y + d / 2, d / 2.05, 0, Math.PI * 2, true);
        ctx.fillStyle = "#000000";
        ctx.clip();
        ctx.fill();
        ctx.drawImage(avatar, x, y, d / 1, d / 1);
    }

    public static ordinalSuffixOf(i): string {
        let j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    public static rankFile(elo: number): string {
        if (elo < 30)   return "1-iron.png";
        if (elo < 60)   return "2-iron.png";
        if (elo < 100)  return "3-iron.png";
        if (elo < 130)  return "1-bronze.png";
        if (elo < 160)  return "2-bronze.png";
        if (elo < 200)  return "3-bronze.png";
        if (elo < 230)  return "1-silver.png";
        if (elo < 260)  return "2-silver.png";
        if (elo < 300)  return "3-silver.png";
        if (elo < 330)  return "1-gold.png";
        if (elo < 360)  return "2-gold.png";
        if (elo < 400)  return "3-gold.png";
        if (elo < 430)  return "1-plat.png";
        if (elo < 460)  return "2-plat.png";
        if (elo < 500)  return "3-plat.png";
        if (elo < 530)  return "1-diamond.png";
        if (elo < 560)  return "2-diamond.png";
        if (elo < 600)  return "3-diamond.png";
        if (elo < 630)  return "1-ascendant.png";
        if (elo < 660)  return "2-ascendant.png";
        if (elo < 700)  return "3-ascendant.png";
        if (elo < 730)  return "1-immortal.png";
        if (elo < 760)  return "2-immortal.png";
        if (elo < 800)  return "3-immortal.png";
        return "radiant.png"
    }
}