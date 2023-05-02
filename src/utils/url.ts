export const absolutePath = function (href: string) {
  let link = document.createElement('a');
  link.href = href;
  return link.href;
};
