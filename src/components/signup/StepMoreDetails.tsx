"use client";

import { useEffect, useState } from "react";
import { SignupData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import { fetchNationalities, fetchLanguages } from "@/lib/country_lang.api";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Input from "../ui/Input";
import MultiSelect from "../ui/MultiSelect";

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

  if (loading) {
    return <p className="text-black">Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-black mb-8">More About You</h2>

      <div className="space-y-15">
        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Nationality"
            value={data.nationality}
            options={countries}
            onChange={(v) => setData({ ...data, nationality: v })}
          />

          <div>
            <label className="block text-black text-sm font-semibold mb-2">Gender :</label>
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

          <Input
            label="Occupation"
            value={data.occupation}
            onChange={(v) => setData({ ...data, occupation: v })}
          />
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <MultiSelect
              label="Languages Spoken"
              options={languages}
              value={data.languages}
              onChange={(v) => setData({ ...data, languages: v })}
            />
          </div>
<div className="mt-4">
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
