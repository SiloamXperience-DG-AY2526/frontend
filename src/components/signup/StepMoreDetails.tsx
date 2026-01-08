"use client";

import { useEffect, useState } from "react";
import { SignUpFormProps } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import { fetchNationalities, fetchLanguages } from "@/lib/countries";
import Textarea from "../ui/TextArea";
import Select from "../ui/Select";
import Input from "../ui/Input";
import MultiSelect from "../ui/MultiSelect";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
] as const;

//cache to avoid reloading and flickering

const CACHE_KEY = "more_details_meta_v1";

function getCachedMeta(): { countries: string[]; languages: string[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export default function MoreAboutYou({
  data,
  setData,
  next,
  back,
}: SignUpFormProps) {
  const cachedMeta = getCachedMeta();

  const [countries, setCountries] = useState<string[]>(
    cachedMeta?.countries ?? []
  );
  const [languages, setLanguages] = useState<string[]>(
    cachedMeta?.languages ?? []
  );
  const [loading, setLoading] = useState(!cachedMeta);

  useEffect(() => {
    if (cachedMeta) return;

    const load = async () => {
      try {
        const [c, l] = await Promise.all([
          fetchNationalities(),
          fetchLanguages(),
        ]);

        setCountries(c);
        setLanguages(l);

        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ countries: c, languages: l })
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cachedMeta]);
  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-black/10 rounded w-1/3 mx-auto" />

        <div className="grid grid-cols-2 gap-6">
          <div className="h-10 bg-black/10 rounded" />
          <div className="h-10 bg-black/10 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="h-10 bg-black/10 rounded" />
          <div className="h-10 bg-black/10 rounded" />
        </div>

        <div className="h-20 bg-black/10 rounded" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-black mb-8 mt-3">
        More About You
      </h2>

      <div className="space-y-4">
        {/*nationality  */}
        <div className="grid grid-cols-2 gap-5">
          <Select
            label="Nationality"
            value={data.nationality}
            options={countries}
            onChange={(v) => setData({ ...data, nationality: v })}
          />

          <div>
            <label className="block text-black text-sm font-semibold mb-2">
              Gender :
            </label>
            <div className="flex gap-6">
              {genderOptions.map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={data.gender === value}
                    onChange={() => setData({ ...data, gender: value })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* dob and occupation */}
        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            type="date"
            value={data.dob}
            onChange={(v) => setData({ ...data, dob: v })}
          />

          <Input
            label="Occupation"
            value={data.occupation}
            onChange={(v) => setData({ ...data, occupation: v })}
          />
        </div>

        {/* language and qualification */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <MultiSelect
              label="Languages Spoken"
              options={languages}
              value={data.languages}
              onChange={(v) => setData({ ...data, languages: v })}
            />
          </div>
          <div>
            <Select
              label="Highest Qualification"
              value={data.qualification}
              options={[
                "Secondary School",
                "Diploma",
                "Bachelor's Degree",
                "Master's Degree",
                "Doctorate",
                "Others",
              ]}
              onChange={(v) => setData({ ...data, qualification: v })}
            />
          </div>
        </div>
        {/*Address*/}
        <Textarea
          label="Address"
          value={data.address}
          onChange={(v) => setData({ ...data, address: v })}
        />
      </div>

      <div className="mt-5 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button label="NEXT →" onClick={next} />
      </div>
    </div>
  );
}
