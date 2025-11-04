import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: ".",
});

export default createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});
