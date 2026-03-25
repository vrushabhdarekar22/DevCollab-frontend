import { Crown, Github, Linkedin, Mail, Users } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENTS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-cyan-500 to-cyan-700",
  "from-fuchsia-500 to-fuchsia-700",
];

function Avatar({ name, size = "lg" }) {
  const idx = (name || "").charCodeAt(0) % AVATAR_GRADIENTS.length;
  const sz =
    size === "lg"
      ? "w-14 h-14 text-lg"
      : size === "md"
      ? "w-10 h-10 text-sm"
      : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sz} rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[idx]}
                  flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg`}
    >
      {getInitials(name)}
    </div>
  );
}

// ── SkillBadge ────────────────────────────────────────────────────────────────
function SkillBadge({ skill }) {
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/8 border border-blue-500/15 text-blue-400">
      {skill}
    </span>
  );
}

// ── MemberCard ────────────────────────────────────────────────────────────────
function MemberCard({ member }) {
  const isOwner = member.role === "owner";

  return (
    <div
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-white/6
                 bg-gray-900/40 hover:border-blue-500/25 hover:bg-gray-900/70 transition-all duration-300 overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 25%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Owner crown accent line */}
      {isOwner && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(250,204,21,0.4), transparent)",
          }}
        />
      )}

      {/* Top row: Avatar + Name + Role */}
      <div className="flex items-start gap-3.5">
        <div className="relative">
          <Avatar name={member.name} size="lg" />
          {isOwner && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-yellow-400" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white truncate">
              {member.name}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isOwner
                  ? "bg-yellow-500/10 border-yellow-500/25 text-yellow-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}
            >
              {isOwner ? "Owner" : "Member"}
            </span>
          </div>
          {member.email && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 flex-shrink-0" />
              {member.email}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-0.5">
          {member.bio}
        </p>
      )}

      {/* Skills */}
      {member.skills && Array.isArray(member.skills) && member.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {member.skills.slice(0, 5).map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
          {member.skills.length > 5 && (
            <span className="text-[11px] text-gray-600 px-2 py-0.5">
              +{member.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Links */}
      {(member.githubURL || member.linkedinURL) && (
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          {member.githubURL && (
            <a
              href={member.githubURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors group/link"
            >
              <Github className="w-3.5 h-3.5 group-hover/link:text-blue-400 transition-colors" />
              <span className="group-hover/link:text-gray-300">GitHub</span>
            </a>
          )}
          {member.githubURL && member.linkedinURL && (
            <span className="text-gray-600">·</span>
          )}
          {member.linkedinURL && (
            <a
              href={member.linkedinURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors group/link"
            >
              <Linkedin className="w-3.5 h-3.5 group-hover/link:text-blue-400 transition-colors" />
              <span className="group-hover/link:text-gray-300">LinkedIn</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── MembersTab ────────────────────────────────────────────────────────────────
export default function MembersTab({ members = [] }) {
  const owner = members.find((m) => m.role === "owner");
  const others = members.filter((m) => m.role !== "owner");

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Members</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {members.length} member{members.length !== 1 ? "s" : ""} in this
            project
          </p>
        </div>

        {/* Count pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-blue-400">
            {members.length}
          </span>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-900/60 border border-white/5 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-gray-700" />
          </div>
          <p className="text-sm font-medium text-gray-500">No members yet</p>
          <p className="text-xs text-gray-700 mt-1">
            Accept join requests to grow your team.
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto pb-4">
          {/* Owner section */}
          {owner && (
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-yellow-600" /> Project Owner
              </p>
              <MemberCard member={owner} />
            </div>
          )}

          {/* Members section */}
          {others.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-2.5">
                Team Members
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {others.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}