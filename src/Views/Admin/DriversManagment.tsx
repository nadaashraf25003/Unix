import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useStageDrivers, { CreateStageDriverData, StageDriver } from "@/Hooks/useStageDrivers";
import useDepartments from "@/Hooks/useDepartments";
import useSectionsByDepartment from "@/Hooks/useSectionByDepartment";
import { 
  Trash2, 
  Edit2, 
  PlusCircle, 
  Link2, 
  Building, 
  Users, 
  Calendar,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Download,
  Copy,
  CheckCircle,
  ChevronRight,
  Globe,
  FolderOpen,
  BookOpen,
  GraduationCap,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type StageDriverFormValues = {
  departmentId: string;
  sectionId: string;
  term: string;
  year: string;
  link: string;
};

const StageDriverManager: React.FC = () => {
  const { studentMaterialsQuery, createStageDriverMutation, updateStageDriverMutation, deleteStageDriverMutation } = useStageDrivers();
  const { departmentsQuery } = useDepartments();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<StageDriverFormValues>();
  const [editingDriver, setEditingDriver] = useState<StageDriver | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const selectedDepartmentId = watch("departmentId");
  const sectionsQuery = useSectionsByDepartment(Number(selectedDepartmentId));

  const isSubmitting = createStageDriverMutation.isPending || updateStageDriverMutation.isPending;

  // Filter and search logic
  const filteredDrivers = studentMaterialsQuery.data?.filter(driver => {
    const matchesSearch = driver.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.departmentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterTerm === "all") return matchesSearch;
    if (filterTerm === "first") return matchesSearch && driver.title.includes("Term First");
    if (filterTerm === "second") return matchesSearch && driver.title.includes("Term Second");
    
    return matchesSearch;
  });

  const onSubmit = (data: StageDriverFormValues) => {
    if (!data.departmentId || !data.sectionId || !data.term || !data.year || !data.link) {
      toast.error("Please fill all fields");
      return;
    }

    const departmentName = departmentsQuery.data?.find(d => d.id === Number(data.departmentId))?.name;
    const selectedSection = sectionsQuery.data?.find(s => s.id === Number(data.sectionId));

    if (!departmentName || !selectedSection) {
      toast.error("Invalid department or section");
      return;
    }

    const payload: CreateStageDriverData = {
      departmentId: Number(data.departmentId),
      stage: selectedSection.stage,
      link: data.link,
      type: "Drive",
      title: `${departmentName} - ${selectedSection.name} - Term ${data.term} - Year ${data.year}`,
    };

    if (editingDriver) {
      updateStageDriverMutation.mutate({ id: editingDriver.id, data: payload }, {
        onSuccess: () => {
          toast.success("🎉 Link updated successfully");
          setEditingDriver(null);
          reset();
        },
        onError: () => toast.error("❌ Failed to update link"),
      });
    } else {
      createStageDriverMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("✨ Link added successfully");
          reset();
        },
        onError: () => toast.error("❌ Failed to add link"),
      });
    }
  };

  const handleEdit = (driver: StageDriver) => {
    setEditingDriver(driver);

    const regex = /(.+) - (.+) - Term (\w+) - Year (\d{4}\/\d{4})/;
    const match = driver.title.match(regex);

    const dept = departmentsQuery.data?.find(d => d.name === driver.departmentName);
    const deptId = dept ? dept.id.toString() : "";
    const sectionId = sectionsQuery.data?.find(s => s.name === (match ? match[2] : ""))?.id.toString() || "";

    setValue("departmentId", deptId);
    setValue("sectionId", sectionId);
    setValue("term", match ? match[3] : "");
    setValue("year", match ? match[4] : "");
    setValue("link", driver.link);
  };

  const handleDelete = (driver: StageDriver) => {
    Swal.fire({
      title: '<div class="text-2xl font-bold text-gray-800 dark:text-white">⚠️ Confirm Deletion</div>',
      html: `
        <div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
            <p class="text-gray-600 dark:text-gray-300 mb-2">The following link will be permanently deleted:</p>
            <p class="font-bold text-lg text-gray-800 dark:text-white">${driver.title}</p>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<span class="flex items-center gap-2"><Trash2 class="w-4 h-4" /> Confirm Delete</span>',
      cancelButtonText: '<span class="flex items-center gap-2">Cancel</span>',
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 rounded-xl font-bold',
        cancelButton: 'px-6 py-3 rounded-xl font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStageDriverMutation.mutate(driver.id, {
          onSuccess: () => toast.success("🗑️ Link deleted successfully"),
          onError: () => toast.error("❌ Failed to delete"),
        });
      }
    });
  };

  const getTermColor = (term: string) => {
    switch (term) {
      case "First":
        return "from-blue-500 to-cyan-400";
      case "Second":
        return "from-emerald-500 to-green-400";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  const extractDriverInfo = (driver: StageDriver) => {
    const regex = /(.+) - (.+) - Term (\w+) - Year (\d{4}\/\d{4})/;
    const match = driver.title.match(regex);
    
    return {
      department: driver.departmentName || (match ? match[1] : "-"),
      section: match ? match[2] : "-",
      term: match ? match[3] : "-",
      year: match ? match[4] : "-"
    };
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast.success("📋 Link copied");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getDepartmentStats = () => {
    const stats: Record<string, number> = {};
    studentMaterialsQuery.data?.forEach(driver => {
      const dept = driver.departmentName || "Unknown";
      stats[dept] = (stats[dept] || 0) + 1;
    });
    return stats;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-info/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-primary to-secondary p-4 rounded-2xl shadow-2xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Study Materials Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Add and organize material links for each department and batch
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-primary dark:text-dark-primary">
                {studentMaterialsQuery.data?.length || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Links</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-info dark:text-dark-info">
                {departmentsQuery.data?.length || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Departments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Form Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${editingDriver ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                      {editingDriver ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {editingDriver ? "Edit Link" : "Add New Link"}
                    </h2>
                  </div>
                  {editingDriver && (
                    <button
                      onClick={() => { reset(); setEditingDriver(null); }}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {/* Department */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Department
                  </label>
                  <div className="relative">
                    <select
                      {...register("departmentId", { required: "Select department" })}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.departmentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                    >
                      <option value="">Select Department...</option>
                      {departmentsQuery.data?.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Section / Group
                  </label>
                  <select
                    {...register("sectionId", { required: "Select section" })}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.sectionId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all disabled:opacity-50`}
                    disabled={!selectedDepartmentId}
                  >
                    <option value="">{selectedDepartmentId ? "Select Section..." : "Select department first"}</option>
                    {sectionsQuery.data?.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Stage {s.stage})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Term */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Term
                    </label>
                    <select
                      {...register("term", { required: "Select term" })}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.term ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                    >
                      <option value="">Term...</option>
                      <option value="First">First</option>
                      <option value="Second">Second</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Year
                    </label>
                    <input
                      {...register("year", { 
                        required: "Enter academic year",
                        pattern: {
                          value: /^\d{4}\/\d{4}$/,
                          message: "Format: 2024/2025"
                        }
                      })}
                      placeholder="2024/2025"
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.year ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                    />
                  </div>
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Drive Link
                  </label>
                  <input
                    {...register("link", { 
                      required: "Enter link",
                      pattern: {
                        value: /^(https?:\/\/)/,
                        message: "Start with http:// or https://"
                      }
                    })}
                    placeholder="https://drive.google.com/..."
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${errors.link ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </span>
                  ) : editingDriver ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Update Link
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <PlusCircle className="w-5 h-5" />
                      Add Link
                    </span>
                  )}
                </button>
              </form>

              {/* Form Stats */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Total Links: {studentMaterialsQuery.data?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    {departmentsQuery.data?.length || 0} departments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-info to-cyan-500 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Study Materials</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage material links for each department and section</p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search links..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-4 pl-10 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                    />
                  </div>
                  <select
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Links</option>
                    <option value="first">First Term</option>
                    <option value="second">Second Term</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="p-6">
              {studentMaterialsQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
                </div>
              ) : filteredDrivers?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-6">
                    <FolderOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    No links found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm ? "No results found" : "Start by adding a new link"}
                  </p>
                  <button
                    onClick={() => { setSearchTerm(""); setFilterTerm("all"); }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    Show All
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDrivers?.map((driver, index) => {
                    const info = extractDriverInfo(driver);
                    const isCopied = copiedLink === driver.link;
                    
                    return (
                      <div
                        key={driver.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:border-primary/30 animate-slideDown"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Left Side - Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 bg-gradient-to-br ${getTermColor(info.term)} rounded-xl`}>
                                <GraduationCap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                  {driver.title}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                                    <Building className="w-3 h-3" />
                                    {info.department}
                                  </span>
                                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                                    <Users className="w-3 h-3" />
                                    {info.section}
                                  </span>
                                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm text-white bg-gradient-to-r ${getTermColor(info.term)}`}>
                                    <Calendar className="w-3 h-3" />
                                    {info.term === "First" ? "First Term" : "Second Term"}
                                  </span>
                                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                                    📅 {info.year}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Side - Actions */}
                          <div className="flex items-center gap-2">
                            <a
                              href={driver.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 group"
                            >
                              <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span>Open</span>
                            </a>
                            <button
                              onClick={() => copyToClipboard(driver.link)}
                              className={`px-3 py-2 rounded-xl border transition-all ${isCopied ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-600' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                              title="Copy link"
                            >
                              {isCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleEdit(driver)}
                              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(driver)}
                              className="px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      First Term: {filteredDrivers?.filter(d => d.title.includes("Term First")).length}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Second Term: {filteredDrivers?.filter(d => d.title.includes("Term Second")).length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Showing <span className="font-bold text-primary">{filteredDrivers?.length}</span> of <span className="font-bold">{studentMaterialsQuery.data?.length}</span>
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      ✕ Clear Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(getDepartmentStats()).slice(0, 3).map(([dept, count], index) => (
              <div key={dept} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{dept} Department</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{count} links</div>
                  </div>
                  <div className="text-4xl opacity-20">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageDriverManager;