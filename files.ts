import { parse } from "csv";

export interface Request {
  seq: number;
  message: string;
}

export async function loadRequests(path: string): Promise<Request[]> {
  return parse(await Deno.readTextFile(path), {
    skipFirstRow: true,
    trimLeadingSpace: true,
    parse: (input) => {
      const e = input as { seq: string; message: string };
      return { seq: Number(e.seq), message: e.message };
    },
  }) as Promise<Request[]>;
}

export interface Result {
  seq: number;
  message: string;
  error: string | undefined;
}

export class ResultWriter {
  private constructor(private path: string) {}

  static async createNewFile(
    path: string,
    option?: { withHeader?: boolean },
  ): Promise<ResultWriter> {
    const ins = new ResultWriter(path);
    await Deno.writeTextFile(
      ins.path,
      option?.withHeader ? `seq,message,error\n` : "",
    );
    return ins;
  }

  async appendRecord(result: Result) {
    await Deno.writeTextFile(
      this.path,
      `${result.seq},${result.message},${result.error ?? ""}\n`,
      { append: true },
    );
  }
}
