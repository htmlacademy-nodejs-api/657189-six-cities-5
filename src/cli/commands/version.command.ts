import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { Command } from "./command.interface.js";

type PackageJSONConfig = {
  version: string;
};

const isPackageJSONConfig = (value: unknown): value is PackageJSONConfig => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, "version")
  );
};

export class VersionCommand implements Command {
  constructor(private readonly filePath: string = "./package.json") {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), "utf-8");
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error("Failed to parse json content");
    }

    return importedContent.version;
  }

  getName(): string {
    return "--version";
  }

  public async execute(): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(version);
    } catch (error) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
