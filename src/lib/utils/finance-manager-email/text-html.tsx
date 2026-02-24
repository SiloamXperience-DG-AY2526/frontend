
export function safeTextToHtml(text: string) {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return escaped.replaceAll("\n", "<br/>");
}


export function htmlToText(html: string) {
  return (html || "")
    .replaceAll("<br/>", "\n")
    .replaceAll("<br />", "\n")
    .replaceAll("<br>", "\n")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}
