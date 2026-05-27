"use client";
import React, { useEffect, useState } from "react";
import LabForm, { LabTestDetails } from "../../../components/LabForm";
import { useParams } from "next/navigation";
import fetcher from "@/lib/fetcher";
import { toast } from "react-toastify";
import { LabWithMissingPrices } from "@/app/admin/datamiss/page";
import { FiFileText } from "react-icons/fi";

const Page = () => {
  const [labDetails, setLabDetails] = useState<LabTestDetails>({
    name: "",
    details: [],
  });
  const [loading, setLoading] = useState(false);
  const [datamissByLab, setDatamissByLab] = useState<LabWithMissingPrices[]>(
    [],
  );

  const { id } = useParams();

  useEffect(() => {
    fetcher.get<LabTestDetails>(`/admin/labs/tests/${id}`).then((res) => {
      if (res.status === 200 && res.body) {
        const labDetails: LabTestDetails = {
          details: res.body.details || [],
          name: res.body.name || "",
        };
        setLabDetails(labDetails);
      }
    });
    fetchDatamissByLab(id);
  }, [id]);

  async function fetchDatamissByLab(id?: string | string[]) {
    if (!id) return;
    if (Array.isArray(id)) id = id[0];
    fetcher
      .get<LabWithMissingPrices[]>("/admin/datamiss?labId=" + id)
      .then((res) => {
        if (res.body) {
          setDatamissByLab(res.body);
        }
      });
  }

  async function saveLab() {
    setLoading(true);
    const res = await fetcher.post<LabTestDetails, { messege: string }>(
      `/admin/labs/tests/${id}`,
      labDetails,
    );
    if (res.status === 200) {
      toast.success("Lab saved successfully");
    } else {
      toast.error(res.error || "Error saving lab");
    }
    setLoading(false);
  }

  return (
    <>
      <LabForm
        labDetails={labDetails}
        loading={loading}
        error={null}
        onChange={{ labDetails: setLabDetails }}
        onSave={async () => {
          await saveLab();
          await fetchDatamissByLab(id);
        }}
      />
      {datamissByLab.map((lab) => (
        <div
          key={lab.lab._id}
          className="mb-6 max-w-6xl mx-auto rounded-lg mt-6"
        >
          <div className="text-xl font-semibold mb-2">
            Remaining Tests to Add
          </div>
          {/* <h2 className="text-xl font-semibold mb-2">{lab.lab.name}</h2> */}
          <div className="bg-white dark:bg-[#111] border border-orange-200 dark:border-orange-500/20 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-300 dark:hover:border-orange-500/40 relative overflow-hidden flex flex-col sm:flex-row justify-between gap-6">
            {/* Accent line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 dark:bg-orange-500"></div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {lab.lab.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                  {lab.missingTests.length} Missing{" "}
                  {lab.missingTests.length === 1 ? "Test" : "Tests"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {lab.missingTests.map((missingTest) => (
                  <span
                    key={missingTest.test._id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                  >
                    <FiFileText className="w-3 h-3 opacity-70" />
                    {missingTest.testName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Page;
