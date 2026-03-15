import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

type IncidentEvent = {
  time: number;
  service: string;
  event: string;
  message: string;
};

type Incident = {
  incident_id: string;
  title: string;
  severity: string;
  status: string;
  services: string[];
  events: IncidentEvent[];
};

type Analysis = {
  incident_id: string;
  summary: string;
  root_cause: string;
  impact: string;
  operator_note: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const stateColors: Record<string, string> = {
  healthy: "#3b82f6",
  warning: "#facc15",
  critical: "#ef4444",
  recovering: "#22c55e",
};

function getServiceState(
  events: IncidentEvent[],
  service: string,
  currentTime: number
) {
  const serviceEvents = events.filter(
    (e) => e.service === service && e.time <= currentTime
  );

  if (serviceEvents.length === 0) return "healthy";

  const latest = serviceEvents[serviceEvents.length - 1];

  if (["service_crash", "timeout", "queue_overflow"].includes(latest.event)) {
    return "critical";
  }

  if (latest.event === "recovery") return "recovering";

  if (
    ["latency_spike", "service_degraded", "traffic_surge"].includes(latest.event)
  ) {
    return "warning";
  }

  return "healthy";
}

function getSeverityClass(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "badge badge-critical";
    case "high":
      return "badge badge-high";
    case "medium":
      return "badge badge-medium";
    default:
      return "badge";
  }
}

function getAlertLevel(eventType: string) {
  if (eventType === "service_crash") return "critical";
  if (["timeout", "queue_overflow"].includes(eventType)) return "warning";
  if (eventType === "recovery") return "recovery";
  return "info";
}

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertLevel, setAlertLevel] = useState<string>("info");

  const lastProcessedEventRef = useRef<string>("");
  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    axios.get(`${API_BASE}/incidents`).then((res) => {
      const data = res.data as Incident[];
      setIncidents(data);
      if (data.length > 0) {
        setSelectedId(data[0].incident_id);
      }
    });
  }, []);

  const selectedIncident = useMemo(
    () => incidents.find((i) => i.incident_id === selectedId) || null,
    [incidents, selectedId]
  );

  useEffect(() => {
    if (!selectedIncident) return;

    axios
      .get(`${API_BASE}/incidents/${selectedIncident.incident_id}/analysis`)
      .then((res) => setAnalysis(res.data));

    setCurrentTime(0);
    setIsPlaying(false);
    setAlertMessage("");
    setAlertLevel("info");
    lastProcessedEventRef.current = "";
  }, [selectedIncident]);

  useEffect(() => {
    if (!selectedIncident || !isPlaying) return;

    const maxTime = Math.max(...selectedIncident.events.map((e) => e.time), 0);

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + speed;
        if (next >= maxTime) {
          clearInterval(timer);
          setIsPlaying(false);
          return maxTime;
        }
        return next;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [isPlaying, selectedIncident, speed]);

  const visibleEvents = useMemo(() => {
    if (!selectedIncident) return [];
    return selectedIncident.events.filter((e) => e.time <= currentTime);
  }, [selectedIncident, currentTime]);

  const maxTime = selectedIncident
    ? Math.max(...selectedIncident.events.map((e) => e.time), 0)
    : 0;

  const latestVisibleEvent =
    visibleEvents.length > 0 ? visibleEvents[visibleEvents.length - 1] : null;

  function playSound(name: "start" | "warning" | "critical" | "complete") {
    if (isMuted) return;

    const srcMap = {
      start: "/sounds/start.mp3",
      warning: "/sounds/warning.mp3",
      critical: "/sounds/critical.mp3",
      complete: "/sounds/complete.mp3",
    };

    try {
      if (!audioCacheRef.current[name]) {
        audioCacheRef.current[name] = new Audio(srcMap[name]);
        audioCacheRef.current[name].volume = 0.18;
      }

      const audio = audioCacheRef.current[name];
      audio.currentTime = 0;
      void audio.play();
    } catch (error) {
      console.error("Sound playback failed:", error);
    }
  }

  useEffect(() => {
    if (!latestVisibleEvent) return;

    const eventKey = `${latestVisibleEvent.service}-${latestVisibleEvent.time}-${latestVisibleEvent.event}`;

    if (lastProcessedEventRef.current === eventKey) return;

    lastProcessedEventRef.current = eventKey;
    setAlertMessage(
      `T+${latestVisibleEvent.time}s · ${latestVisibleEvent.service.toUpperCase()} · ${latestVisibleEvent.event}`
    );
    setAlertLevel(getAlertLevel(latestVisibleEvent.event));

    if (latestVisibleEvent.time === 0) {
      playSound("start");
    } else if (latestVisibleEvent.event === "service_crash") {
      playSound("critical");
    } else if (["timeout", "queue_overflow"].includes(latestVisibleEvent.event)) {
      playSound("warning");
    } else if (
      latestVisibleEvent.event === "recovery" &&
      currentTime >= maxTime
    ) {
      playSound("complete");
    }
  }, [latestVisibleEvent, currentTime, maxTime, isMuted]);

  const nodes: Node[] = useMemo(() => {
    if (!selectedIncident) return [];

    const positions: Record<string, { x: number; y: number }> = {
      frontend: { x: 50, y: 90 },
      api: { x: 270, y: 90 },
      db: { x: 520, y: 90 },
      cache: { x: 270, y: 250 },
      queue: { x: 520, y: 250 },
      worker: { x: 760, y: 250 },
      deploy: { x: 50, y: 250 },
    };

    return selectedIncident.services.map((service) => {
      const state = getServiceState(selectedIncident.events, service, currentTime);
      const color = stateColors[state];

      return {
        id: service,
        data: { label: `${service.toUpperCase()} · ${state}` },
        position: positions[service] || { x: 100, y: 100 },
        style: {
          background: "#0f172a",
          color: "#e5e7eb",
          border: `2px solid ${color}`,
          borderRadius: 16,
          width: 165,
          padding: 10,
          boxShadow: `0 0 24px ${color}`,
          fontWeight: 600,
        },
      };
    });
  }, [selectedIncident, currentTime]);

  const edges: Edge[] = useMemo(() => {
    if (!selectedIncident) return [];

    const allEdges: Edge[] = [
      { id: "frontend-api", source: "frontend", target: "api", animated: true },
      { id: "api-db", source: "api", target: "db", animated: true },
      { id: "api-cache", source: "api", target: "cache", animated: true },
      { id: "api-queue", source: "api", target: "queue", animated: true },
      { id: "queue-worker", source: "queue", target: "worker", animated: true },
      { id: "worker-db", source: "worker", target: "db", animated: true },
    ];

    return allEdges
      .filter(
        (edge) =>
          selectedIncident.services.includes(edge.source) &&
          selectedIncident.services.includes(edge.target)
      )
      .map((edge) => ({
        ...edge,
        style: { strokeWidth: 2.5, stroke: "#60a5fa" },
      }));
  }, [selectedIncident]);

  return (
    <div className="page">
      <div className="container">
        <header className="panel header-panel">
          <div>
            <h1 className="title">AI Incident Replay Studio</h1>
            <p className="subtitle">
              Visual incident investigation with replay, system flow, AI narrative, and alert sound cues
            </p>
          </div>

          <div className="header-controls">
            <select
              className="select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {incidents.map((incident) => (
                <option key={incident.incident_id} value={incident.incident_id}>
                  {incident.incident_id} — {incident.title}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={() => setIsPlaying(true)}>
              Play
            </button>

            <button className="btn" onClick={() => setIsPlaying(false)}>
              Pause
            </button>

            <button
              className="btn"
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
                setAlertMessage("");
              }}
            >
              Reset
            </button>

            <select
              className="select"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>

            <button className="btn" onClick={() => setIsMuted((prev) => !prev)}>
              {isMuted ? "Muted" : "Sound On"}
            </button>
          </div>
        </header>

        {alertMessage && (
          <div className={`panel alert-banner alert-${alertLevel}`}>
            {alertMessage}
          </div>
        )}

        {selectedIncident && (
          <section className="top-grid">
            <div className="panel stat-card">
              <span className="label">Incident</span>
              <strong>{selectedIncident.title}</strong>
            </div>

            <div className="panel stat-card">
              <span className="label">Severity</span>
              <strong className={getSeverityClass(selectedIncident.severity)}>
                {selectedIncident.severity.toUpperCase()}
              </strong>
            </div>

            <div className="panel stat-card">
              <span className="label">Status</span>
              <strong>{selectedIncident.status.toUpperCase()}</strong>
            </div>

            <div className="panel stat-card">
              <span className="label">Replay Time</span>
              <strong>T+{currentTime}s</strong>
            </div>
          </section>
        )}

        <section className="main-grid">
          <div className="panel graph-panel">
            <div className="panel-header">
              <h2>System Graph</h2>
              <span>Live service state replay</span>
            </div>

            <div className="graph-box">
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </div>

          <div className="panel narrative-panel">
            <div className="panel-header">
              <h2>AI Narrative</h2>
              <span>Rule-based investigation summary</span>
            </div>

            <div className="narrative-block">
              <div className="label">Summary</div>
              <p>{analysis?.summary || "Loading analysis..."}</p>
            </div>

            <div className="narrative-block">
              <div className="label">Root Cause</div>
              <p>{analysis?.root_cause || "-"}</p>
            </div>

            <div className="narrative-block">
              <div className="label">Impact</div>
              <p>{analysis?.impact || "-"}</p>
            </div>

            <div className="narrative-block">
              <div className="label">Operator Note</div>
              <p>{analysis?.operator_note || "-"}</p>
            </div>
          </div>
        </section>

        <section className="panel timeline-panel">
          <div className="panel-header">
            <h2>Timeline Player</h2>
            <span>Replay progress through incident events</span>
          </div>

          <input
            type="range"
            min={0}
            max={maxTime}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="slider"
          />

          <div className="timeline-row">
            <span>T+0s</span>
            <span>T+{currentTime}s</span>
            <span>T+{maxTime}s</span>
          </div>
        </section>

        <section className="panel event-panel">
          <div className="panel-header">
            <h2>Event Feed</h2>
            <span>Chronological replay output</span>
          </div>

          <div className="event-list">
            {visibleEvents.length === 0 && (
              <div className="muted">No events visible yet. Press Play.</div>
            )}

            {visibleEvents.map((event, idx) => (
              <div key={`${event.service}-${event.time}-${idx}`} className="event-card">
                <div className="event-top">
                  <strong>
                    T+{event.time}s · {event.service.toUpperCase()}
                  </strong>
                  <span className="event-type">{event.event}</span>
                </div>
                <div className="event-message">{event.message}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}