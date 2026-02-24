export function classNames(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}