"use client";

import { useEffect, useState } from "react";

/** Timezone picker defaulting to the visitor's own timezone (they can change it). */
export function TimezoneSelect({
  name = "timezone",
  value,
  defaultValue,
  onChange,
  className = "field",
  id,
}: {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (tz: string) => void;
  className?: string;
  id?: string;
}) {
  const [zones, setZones] = useState<string[]>([]);
  const [detected, setDetected] = useState(defaultValue ?? "UTC");

  useEffect(() => {
    const intl = Intl as unknown as { supportedValuesOf?: (k: string) => string[] };
    setZones(intl.supportedValuesOf?.("timeZone") ?? ["UTC"]);
    if (!defaultValue) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      setDetected(tz);
      onChange?.(tz);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = value ?? detected;
  const list = zones.includes(current) ? zones : [current, ...zones];

  return (
    <select
      id={id ?? name}
      name={name}
      className={className}
      value={current}
      onChange={(e) => {
        setDetected(e.target.value);
        onChange?.(e.target.value);
      }}
    >
      {list.map((z) => (
        <option key={z} value={z}>
          {z.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
