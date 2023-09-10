import { Command, HelpCommand } from "cliffy";
import * as files from "./files.ts";
import * as discord from "./discord.ts";

if (import.meta.main) {
  await new Command()
    .name("dcs")
    .version("0.1.0")
    .description("Deno CLI Sample")
    .default("help")
    .command("notify", "Discordに通知する")
    .option("--dry", "dry run")
    .option("-i, --input-file <file:string>", "入力CSVファイルのパス", {
      default: "input.csv",
    })
    .option("-o, --output-file <file:string>", "出力CSVファイルのパス", {
      default: "output.csv",
    })
    .env("DISCORD_WEBHOOK_URL=<value>", "Discord Webhook URL", {
      required: true,
    })
    .action(notify)
    .command("help", new HelpCommand())
    .parse(Deno.args);
}

async function notify(
  option: {
    inputFile: string;
    outputFile: string;
    discordWebhookUrl: string;
    dry?: boolean;
  },
) {
  const { inputFile, outputFile, discordWebhookUrl, dry } = option;

  const requests = await files.loadRequests(inputFile);
  const writer = await files.ResultWriter.createNewFile(outputFile, {
    withHeader: true,
  });

  for (const r of requests) {
    const err = dry
      ? console.log(`[Dry run]: Notify "${r.message}"`)
      : await discord.notify(discordWebhookUrl, r.message);
    writer.appendRecord({
      seq: r.seq,
      message: r.message,
      error: err ? err.message : "",
    });
  }
}
