import { useNavigate } from "react-router-dom";

export default function SystemDesignPage() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">
        System Design Topics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* HLD Card */}
        <div
          onClick={() => navigate("/system-design/hld")}
          className="bg-white dark:bg-slate-800 
                     p-10 rounded-2xl 
                     shadow-md hover:shadow-xl 
                     border border-gray-200 dark:border-slate-700
                     cursor-pointer transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">
            HLD
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            High Level Design – Theory & architecture concepts.
          </p>
        </div>

        {/* LLD Card */}
        <div
          onClick={() => navigate("/system-design/lld")}
          className="bg-white dark:bg-slate-800 
                     p-10 rounded-2xl 
                     shadow-md hover:shadow-xl 
                     border border-gray-200 dark:border-slate-700
                     cursor-pointer transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-3">
            LLD
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Low Level Design – Patterns & implementation code.
          </p>
        </div>

      </div>
    </div>
  );
}