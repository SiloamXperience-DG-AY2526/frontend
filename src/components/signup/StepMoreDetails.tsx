"use client";

import { useEffect, useState } from "react";
import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import { fetchNationalities, fetchLanguages } from "@/lib/country_lang.api";

interface Props {
  data: SignupData;
  setData: (d: SignupData) => void;
  next: () => void;
  back: () => void;
}

export default function AboutYou({ data, setData, next, back }: Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [c, l] = await Promise.all([
        fetchNationalities(),
        fetchLanguages(),
      ]);
      setCountries(c);
      setLanguages(l);
      setLoading(false);
    };
    load();
  }, []);

  const toggleLanguage = (lang: string) => {
    setData({
      ...data,
      languages: data.languages.includes(lang)
        ? data.languages.filter((l) => l !== lang)
        : [...data.languages, lang],
    });
  };

  if (loading) {
    return <p className="text-black">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-8">More About You</h2>

      <div className="space-y-6">
        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Nationality"
            value={data.nationality}
            options={countries}
            onChange={(v) => setData({ ...data, nationality: v })}
          />

          <div>
            <label className="block text-black text-sm mb-2">Gender</label>
            <div className="flex gap-6">
              {["Male", "Female", "Others"].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={data.gender === g}
                    onChange={() => setData({ ...data, gender: g as any })}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Date of Birth"
            type="date"
            value={data.dob}
            onChange={(v) => setData({ ...data, dob: v })}
          />

          <Textarea
            label="Occupation"
            value={data.occupation}
            onChange={(v) => setData({ ...data, occupation: v })}
          />
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-black text-sm mb-2">
              Languages Spoken
            </label>
            <div className="flex flex-wrap gap-3 max-h-28 overflow-y-auto">
              {languages.map((lang) => (
                <label key={lang} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={data.languages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

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

        {/* ROW 4 */}
        <Textarea
          label="Address"
          value={data.address}
          onChange={(v) => setData({ ...data, address: v })}
        />
      </div>

      <div className="mt-12 flex justify-between">
        <Button label="Back" variant="secondary" onClick={back} />
        <Button label="NEXT →" onClick={next} />
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-black text-sm mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none py-1.5"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black text-sm mb-1">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none resize-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none py-1.5 bg-transparent"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
