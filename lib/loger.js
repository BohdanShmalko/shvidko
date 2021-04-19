module.exports = {
  warning: (description, warning = "") =>
    console.log(
      "\x1b[33m%s\x1b[0m",
      `WARNING : ${description}"\n\n"${warning}`
    ),
  error: (description, error = "") =>
    console.error(`ERROR : ${description}"\n\n${error}`),
  log: (inf) => console.log(inf),
};
