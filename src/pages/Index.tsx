import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Data ────────────────────────────────────────────────────────────────────

const RANKS = [
  { label: "Главный Админ", color: "#e63946", bg: "rgba(230,57,70,0.15)", border: "rgba(230,57,70,0.4)" },
  { label: "Ст. Администратор", color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.4)" },
  { label: "Администратор", color: "#818cf8", bg: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.4)" },
  { label: "Модератор", color: "#34d399", bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.3)" },
  { label: "Хелпер", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" },
];

const ADMINS = [
  { id: 1, nick: "DarkWolf", steamId: "STEAM_0:1:12345678", rank: 0, status: "online", tickets: 24, warnings: 0, solved: 21 },
  { id: 2, nick: "ShadowX", steamId: "STEAM_0:0:23456789", rank: 1, status: "online", tickets: 18, warnings: 1, solved: 15 },
  { id: 3, nick: "Neon_Knight", steamId: "STEAM_0:1:34567890", rank: 2, status: "afk", tickets: 31, warnings: 0, solved: 29 },
  { id: 4, nick: "Phantom", steamId: "STEAM_0:0:45678901", rank: 2, status: "offline", tickets: 12, warnings: 2, solved: 10 },
  { id: 5, nick: "RedStrike", steamId: "STEAM_0:1:56789012", rank: 3, status: "online", tickets: 8, warnings: 1, solved: 7 },
  { id: 6, nick: "IceCore", steamId: "STEAM_0:0:67890123", rank: 3, status: "online", tickets: 6, warnings: 0, solved: 6 },
  { id: 7, nick: "VoidRunner", steamId: "STEAM_0:1:78901234", rank: 4, status: "offline", tickets: 3, warnings: 3, solved: 2 },
  { id: 8, nick: "BladeEdge", steamId: "STEAM_0:0:89012345", rank: 4, status: "online", tickets: 5, warnings: 0, solved: 5 },
];

const TICKETS = [
  { id: 1001, title: "Жалоба на читера", player: "Ghost_Player", assignee: "DarkWolf", priority: "high", status: "open", date: "28.05.2026", desc: "Подозрение в использовании wallhack на 2-м раунде" },
  { id: 1002, title: "Проблема с балансом", player: "Venom_X", assignee: "Neon_Knight", priority: "medium", status: "progress", date: "27.05.2026", desc: "Неверно списаны монеты после ивента" },
  { id: 1003, title: "Некорректный бан", player: "TigerFox", assignee: "ShadowX", priority: "high", status: "closed", date: "27.05.2026", desc: "Бан выдан ошибочно, требует апелляции" },
  { id: 1004, title: "Технический сбой", player: "Pixel_Storm", assignee: "BladeEdge", priority: "low", status: "open", date: "26.05.2026", desc: "Вылет с сервера при входе в зону" },
  { id: 1005, title: "Мут без причины", player: "SilentFire", assignee: "IceCore", priority: "medium", status: "progress", date: "26.05.2026", desc: "Выдан мут на 60 мин без комментария" },
  { id: 1006, title: "Оскорбление в чате", player: "NightBlade", assignee: "RedStrike", priority: "medium", status: "closed", date: "25.05.2026", desc: "Систематические оскорбления других игроков" },
];

const WARNINGS = [
  { id: 1, admin: "Phantom", issued: "DarkWolf", date: "20.05.2026", reason: "Выдача бана без доказательств", severity: "medium" },
  { id: 2, admin: "DarkWolf", issued: "VoidRunner", date: "18.05.2026", reason: "Бездействие при жалобах", severity: "high" },
  { id: 3, admin: "ShadowX", issued: "VoidRunner", date: "15.05.2026", reason: "Нарушение регламента общения", severity: "medium" },
  { id: 4, admin: "DarkWolf", issued: "VoidRunner", date: "10.05.2026", reason: "Слив информации закрытого чата", severity: "high" },
  { id: 5, admin: "Neon_Knight", issued: "ShadowX", date: "08.05.2026", reason: "Опоздание на дежурство", severity: "low" },
  { id: 6, admin: "DarkWolf", issued: "RedStrike", date: "05.05.2026", reason: "Некорректное поведение с игроком", severity: "medium" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function RankBadge({ rankIdx }: { rankIdx: number }) {
  const r = RANKS[rankIdx];
  return (
    <span className="rank-badge" style={{ color: r.color, background: r.bg, border: `1px solid ${r.border}` }}>
      {r.label}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  return <span className={`status-dot ${status}`} />;
}

function StatusLabel({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    online: { label: "Онлайн", color: "#22c55e" },
    offline: { label: "Оффлайн", color: "#6b6b80" },
    afk: { label: "AFK", color: "#f59e0b" },
  };
  const s = map[status] || map.offline;
  return <span style={{ color: s.color, fontSize: "0.8rem" }}>{s.label}</span>;
}

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, string> = { high: "Высокий", medium: "Средний", low: "Низкий" };
  return <span className={`rank-badge priority-${p}`}>{map[p]}</span>;
}

function TicketStatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = { open: "Открыт", progress: "В работе", closed: "Закрыт" };
  const cls = s === "open" ? "ticket-open" : s === "progress" ? "ticket-progress" : "ticket-closed";
  return <span className={`rank-badge ${cls}`}>{map[s]}</span>;
}

function WarnSeverity({ s }: { s: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    high: { label: "Серьёзный", cls: "priority-high" },
    medium: { label: "Средний", cls: "priority-medium" },
    low: { label: "Незначительный", cls: "priority-low" },
  };
  const v = map[s] || map.medium;
  return <span className={`rank-badge ${v.cls}`}>{v.label}</span>;
}

// ─── Sections ────────────────────────────────────────────────────────────────

function AdminsSection() {
  const [search, setSearch] = useState("");
  const filtered = ADMINS.filter(
    a =>
      a.nick.toLowerCase().includes(search.toLowerCase()) ||
      a.steamId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--panel-muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по нику или SteamID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: "var(--panel-card)",
              border: "1px solid var(--panel-border)",
              color: "var(--panel-white)",
              fontFamily: "'Golos Text', sans-serif",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(230,57,70,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--panel-border)")}
          />
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--panel-muted)" }}>
          <Icon name="Users" size={14} />
          <span>{filtered.length} из {ADMINS.length}</span>
        </div>
      </div>

      <div
        className="grid gap-3 px-4 py-2 mb-2 rounded-lg"
        style={{
          gridTemplateColumns: "2fr 2fr 2.5fr 1fr 1fr 1fr 1fr",
          background: "rgba(255,255,255,0.03)",
          fontSize: "0.7rem",
          color: "var(--panel-muted)",
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
        }}
      >
        <span>Никнейм</span>
        <span>SteamID</span>
        <span>Ранг</span>
        <span>Статус</span>
        <span>Тикеты</span>
        <span>Решено</span>
        <span>Выговоры</span>
      </div>

      <div style={{ background: "var(--panel-card)", borderRadius: "12px", border: "1px solid var(--panel-border)", overflow: "hidden" }}>
        {filtered.map((admin, i) => (
          <div
            key={admin.id}
            className="admin-row grid gap-3 px-4 py-3.5 items-center animate-fade-in-up"
            style={{
              gridTemplateColumns: "2fr 2fr 2.5fr 1fr 1fr 1fr 1fr",
              animationDelay: `${i * 0.04}s`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: RANKS[admin.rank].bg,
                  color: RANKS[admin.rank].color,
                  border: `1px solid ${RANKS[admin.rank].border}`,
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                {admin.nick[0]}
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--panel-white)" }}>{admin.nick}</span>
            </div>
            <span className="text-xs font-mono" style={{ color: "var(--panel-muted)" }}>{admin.steamId}</span>
            <RankBadge rankIdx={admin.rank} />
            <div className="flex items-center gap-2">
              <StatusDot status={admin.status} />
              <StatusLabel status={admin.status} />
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--panel-white)" }}>{admin.tickets}</span>
            <div>
              <span className="text-sm font-medium" style={{ color: "#22c55e" }}>{admin.solved}</span>
              <div className="progress-bar mt-1" style={{ width: "48px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.round((admin.solved / admin.tickets) * 100)}%`,
                    background: "linear-gradient(90deg, #22c55e, #4ade80)",
                  }}
                />
              </div>
            </div>
            <div>
              {admin.warnings > 0 ? (
                <span className="rank-badge priority-high">{admin.warnings}</span>
              ) : (
                <span style={{ color: "var(--panel-muted)", fontSize: "0.85rem" }}>—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketsSection() {
  const [filter, setFilter] = useState<"all" | "open" | "progress" | "closed">("all");
  const filtered = filter === "all" ? TICKETS : TICKETS.filter(t => t.status === filter);
  const counts = {
    open: TICKETS.filter(t => t.status === "open").length,
    progress: TICKETS.filter(t => t.status === "progress").length,
    closed: TICKETS.filter(t => t.status === "closed").length,
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { key: "all", label: "Все", count: TICKETS.length },
          { key: "open", label: "Открытые", count: counts.open },
          { key: "progress", label: "В работе", count: counts.progress },
          { key: "closed", label: "Закрытые", count: counts.closed },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
            style={{
              fontFamily: "'Golos Text', sans-serif",
              background: filter === tab.key ? "var(--panel-red)" : "var(--panel-card)",
              color: filter === tab.key ? "#fff" : "var(--panel-muted)",
              border: `1px solid ${filter === tab.key ? "transparent" : "var(--panel-border)"}`,
              boxShadow: filter === tab.key ? "0 0 12px var(--panel-red-glow)" : "none",
            }}
          >
            {tab.label}
            <span
              className="px-1.5 py-0.5 rounded text-xs font-bold"
              style={{
                background: filter === tab.key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                color: filter === tab.key ? "#fff" : "var(--panel-muted)",
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((ticket, i) => (
          <div
            key={ticket.id}
            className="glass-card rounded-xl p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="red-line h-10 self-stretch flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "var(--panel-muted)" }}>#{ticket.id}</span>
                    <span className="font-semibold text-sm" style={{ color: "var(--panel-white)" }}>{ticket.title}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--panel-muted)" }}>{ticket.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge p={ticket.priority} />
                <TicketStatusBadge s={ticket.status} />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 flex-wrap" style={{ fontSize: "0.75rem", color: "var(--panel-muted)" }}>
              <div className="flex items-center gap-1.5">
                <Icon name="User" size={12} />
                <span>Игрок: <span style={{ color: "var(--panel-white)" }}>{ticket.player}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="Shield" size={12} />
                <span>Назначен: <span style={{ color: "var(--panel-white)" }}>{ticket.assignee}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="Calendar" size={12} />
                <span>{ticket.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarningsSection() {
  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {ADMINS.filter(a => a.warnings > 0).map((admin, i) => (
          <div
            key={admin.id}
            className="glass-card stat-card rounded-xl p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm" style={{ color: "var(--panel-white)" }}>{admin.nick}</span>
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  color: admin.warnings >= 3 ? "#e63946" : admin.warnings >= 2 ? "#f59e0b" : "#94a3b8",
                }}
              >
                {admin.warnings}
              </span>
            </div>
            <RankBadge rankIdx={admin.rank} />
            <div className="progress-bar mt-3">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((admin.warnings / 3) * 100, 100)}%`,
                  background:
                    admin.warnings >= 3
                      ? "linear-gradient(90deg, #e63946, #ff6b7a)"
                      : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--panel-muted)" }}>{admin.warnings} / 3 выговора</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--panel-card)", borderRadius: "12px", border: "1px solid var(--panel-border)", overflow: "hidden" }}>
        <div
          className="grid gap-3 px-5 py-3"
          style={{
            gridTemplateColumns: "2fr 2fr 1fr 3fr",
            fontSize: "0.7rem",
            color: "var(--panel-muted)",
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <span>Получил</span>
          <span>Выдал</span>
          <span>Дата</span>
          <span>Причина</span>
        </div>
        {WARNINGS.map((w, i) => (
          <div
            key={w.id}
            className="admin-row grid gap-3 px-5 py-4 items-start animate-fade-in-up"
            style={{
              gridTemplateColumns: "2fr 2fr 1fr 3fr",
              animationDelay: `${i * 0.05}s`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", fontFamily: "'Oswald', sans-serif" }}
              >
                {w.issued[0]}
              </div>
              <span className="font-semibold text-sm" style={{ color: "#e63946" }}>{w.issued}</span>
            </div>
            <span className="text-sm" style={{ color: "var(--panel-white)" }}>{w.admin}</span>
            <span className="text-xs" style={{ color: "var(--panel-muted)" }}>{w.date}</span>
            <div className="flex items-start gap-2 flex-wrap">
              <span className="text-xs" style={{ color: "var(--panel-white)" }}>{w.reason}</span>
              <WarnSeverity s={w.severity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSection() {
  const totalTickets = ADMINS.reduce((s, a) => s + a.tickets, 0);
  const totalSolved = ADMINS.reduce((s, a) => s + a.solved, 0);
  const onlineCount = ADMINS.filter(a => a.status === "online").length;
  const solveRate = Math.round((totalSolved / totalTickets) * 100);
  const topAdmins = [...ADMINS].sort((a, b) => b.solved - a.solved).slice(0, 5);

  const statCards = [
    { icon: "Users", label: "Всего администраторов", value: ADMINS.length, color: "#818cf8", sub: `${onlineCount} онлайн` },
    { icon: "Ticket", label: "Всего тикетов", value: totalTickets, color: "#e63946", sub: `${TICKETS.filter(t => t.status === "open").length} открытых` },
    { icon: "CheckCircle", label: "Решено тикетов", value: totalSolved, color: "#22c55e", sub: `${solveRate}% эффективность` },
    { icon: "AlertTriangle", label: "Выговоров выдано", value: WARNINGS.length, color: "#f59e0b", sub: "за всё время" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className="glass-card stat-card rounded-xl p-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}
              >
                <Icon name={s.icon} size={18} style={{ color: s.color }} />
              </div>
              <span className="text-3xl font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: s.color }}>
                {s.value}
              </span>
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--panel-white)" }}>{s.label}</p>
            <p className="text-xs" style={{ color: "var(--panel-muted)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="red-line h-5" />
            <span style={{ color: "var(--panel-white)", fontFamily: "'Oswald', sans-serif", fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
              Топ по тикетам
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {topAdmins.map((admin, i) => (
              <div
                key={admin.id}
                className="flex items-center gap-3 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.06}s`, opacity: 0, animationFillMode: "forwards" }}
              >
                <span
                  className="text-lg font-bold w-6 text-center flex-shrink-0"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    color: i === 0 ? "#e63946" : i === 1 ? "#f97316" : i === 2 ? "#818cf8" : "var(--panel-muted)",
                  }}
                >
                  {i + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: RANKS[admin.rank].bg, color: RANKS[admin.rank].color, fontFamily: "'Oswald', sans-serif" }}
                >
                  {admin.nick[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--panel-white)" }}>{admin.nick}</span>
                    <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: "#22c55e", fontFamily: "'Oswald', sans-serif" }}>{admin.solved}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.round((admin.solved / topAdmins[0].solved) * 100)}%`,
                        background: i === 0 ? "linear-gradient(90deg, #e63946, #ff6b7a)" : "linear-gradient(90deg, #6366f1, #818cf8)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="red-line h-5" />
            <span style={{ color: "var(--panel-white)", fontFamily: "'Oswald', sans-serif", fontSize: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
              Состав по рангам
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {RANKS.map((rank, i) => {
              const cnt = ADMINS.filter(a => a.rank === i).length;
              const pct = Math.round((cnt / ADMINS.length) * 100);
              return (
                <div
                  key={rank.label}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs" style={{ color: rank.color, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                      {rank.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: "var(--panel-white)" }}>{cnt} чел.</span>
                  </div>
                  <div className="progress-bar" style={{ height: "4px" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${rank.color}, ${rank.color}aa)`,
                        borderRadius: "2px",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "admins", label: "Администраторы", icon: "Shield" },
  { key: "tickets", label: "Тикеты", icon: "Ticket" },
  { key: "warnings", label: "Выговоры", icon: "AlertTriangle" },
  { key: "stats", label: "Статистика", icon: "BarChart2" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("admins");
  const onlineCount = ADMINS.filter(a => a.status === "online").length;
  const openTickets = TICKETS.filter(t => t.status === "open").length;

  return (
    <div className="min-h-screen" style={{ background: "var(--panel-bg)" }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(230,57,70,0.12) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header
          className="sticky top-0 z-50 animate-fade-in"
          style={{
            background: "rgba(10,10,15,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--panel-border)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center animate-glow-pulse"
                  style={{ background: "var(--panel-red)", boxShadow: "0 0 16px var(--panel-red-glow)" }}
                >
                  <Icon name="Shield" size={16} className="text-white" />
                </div>
                <div>
                  <h1
                    className="font-bold leading-none"
                    style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--panel-white)" }}
                  >
                    ADMIN<span style={{ color: "var(--panel-red)" }}>PANEL</span>
                  </h1>
                  <p className="text-xs leading-none mt-0.5" style={{ color: "var(--panel-muted)" }}>
                    Управление администрацией
                  </p>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex items-center gap-1 overflow-x-auto">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`nav-tab flex items-center gap-2 ${activeTab === tab.key ? "active" : ""}`}
                  >
                    <Icon name={tab.icon} size={13} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Indicators */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <span className="status-dot online" />
                  <span className="text-xs font-medium" style={{ color: "#22c55e" }}>{onlineCount} онлайн</span>
                </div>
                <div
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)" }}
                >
                  <Icon name="Ticket" size={12} style={{ color: "#e63946" }} />
                  <span className="text-xs font-medium" style={{ color: "#e63946" }}>{openTickets} открыт.</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            <div className="red-line h-8" />
            <div>
              <h2 className="section-title">{TABS.find(t => t.key === activeTab)?.label}</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--panel-muted)" }}>
                {activeTab === "admins" && `${ADMINS.length} администраторов в составе`}
                {activeTab === "tickets" && `${TICKETS.length} тикетов в системе`}
                {activeTab === "warnings" && `${WARNINGS.length} записей в истории`}
                {activeTab === "stats" && "Общая статистика деятельности"}
              </p>
            </div>
          </div>

          <div key={activeTab}>
            {activeTab === "admins" && <AdminsSection />}
            {activeTab === "tickets" && <TicketsSection />}
            {activeTab === "warnings" && <WarningsSection />}
            {activeTab === "stats" && <StatsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
