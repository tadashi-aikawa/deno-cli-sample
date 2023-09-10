export async function notify(
  url: string,
  message: string,
): Promise<Error | undefined> {
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message }),
  });
  if (!r.ok) {
    return new Error(
      `Discordへのリクエストに失敗しました。ステータスコード: ${r.status},
      メッセージ: ${await r.text()}`,
    );
  }
}
