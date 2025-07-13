/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Preference Title - Preference description. */
  "preference-name": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `command-name` command */
  export type CommandName = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `command-name` command */
  export type CommandName = {}
}

