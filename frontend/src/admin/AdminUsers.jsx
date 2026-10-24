import { useState, useEffect, useCallback } from "react";
import { Users, Mail, Phone, Calendar, Loader2, RefreshCw, ShieldCheck, Sprout, UserCog } from "lucide-react";
import api from "../api/axios";

const ROLE_TABS = ["all", "farmer", "officer", "admin"];

const ROLE_BADGE = {
  farmer:  { label: "Farmer",  bg: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  officer: { label: "Officer", bg: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  admin:   { label: "Admin",   bg: "bg-rose-100 text-rose-700 border-rose-200" },
};

function RoleBadge({ role }) {
  const cfg = ROLE_BADGE[role] || { label: role, bg: "bg-slate-100 text-slate-600 border-slate-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
}

function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      const list = Array.isArray(res.data?.data) ? res.data.data
        : Array.isArray(res.data) ? res.data : [];
      setUsers(list);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || u.email?.toLowerCase().includes(q)
      || u.phone?.includes(q);
    return matchRole && matchSearch;
  });

  const counts = {
    all: users.length,
    farmer:  users.filter((u) => u.role === "farmer").length,
    officer: users.filter((u) => u.role === "officer").length,
    admin:   users.filter((u) => u.role === "admin").length,
  };

  const TAB_ICONS = { all: Users, farmer: Sprout, officer: ShieldCheck, admin: UserCog };
  const TAB_LABELS = { all: "All", farmer: "Farmers", officer: "Officers", admin: "Admins" };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or phone..."
          className="flex-1 min-w-48 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all"
        />
        <button onClick={fetchUsers} className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ROLE_TABS.map((r) => {
          const Icon = TAB_ICONS[r];
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                roleFilter === r
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {TAB_LABELS[r]}
              <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                roleFilter === r ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {counts[r]}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Users</p>
            <p className="text-xs text-slate-400">{filtered.length} results</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["User", "Email", "Phone", "Role", "Joined"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-sm font-extrabold text-green-600 shrink-0">
                          {(u.role || "U").charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {u.phone
                        ? <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />{u.phone}</div>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
