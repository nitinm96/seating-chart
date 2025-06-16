//function to have first letter uppercase for firstname and lastname
export function CaptializeFullName(name) {
  if (name === "") return;

  let split = name.split(" ");
  for (let i = 0; i < split.length; i++) {
    split[i] = split[i][0].toUpperCase() + split[i].slice(1);
  }
  const sanitizedName = split.join(" ");
  return sanitizedName;
}
