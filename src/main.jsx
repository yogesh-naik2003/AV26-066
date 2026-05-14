import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cloud,
  Download,
  Eye,
  FileText,
  HeartPulse,
  History,
  Home,
  Layers3,
  Lock,
  LogIn,
  Mail,
  Menu,
  Mic,
  Moon,
  PanelLeftClose,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Upload,
  UserCog,
  Users,
  X,
  Zap
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import './styles.css';

const roles = ['Radiologist', 'Doctor', 'Admin', 'Technician', 'Patient'];
const paths = {
  Home: '/',
  Login: '/login',
  Register: '/register',
  Admin: '/dashboard/admin',
  Radiologist: '/dashboard/radiologist',
  Doctor: '/dashboard/doctor',
  Technician: '/dashboard/technician',
  Patient: '/dashboard/patient',
  Upload: '/upload',
  History: '/patient-history',
  Viewer: '/scan-viewer',
  Analysis: '/analysis-result',
  Reports: '/reports',
  Settings: '/settings',
  Notifications: '/notifications'
};

const scans = [];
const trend = [];
const modelBreakdown = [];

function BrainModel() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 48 }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#7dd3fc" />
      <pointLight position={[-4, -3, 3]} intensity={1.5} color="#a78bfa" />
      <Stars radius={45} depth={22} count={900} factor={2.8} saturation={0} fade speed={0.6} />
      <Float speed={2} rotationIntensity={0.65} floatIntensity={1.1}>
        <group>
          <mesh position={[-0.72, 0, 0]}>
            <sphereGeometry args={[1.35, 48, 48]} />
            <meshStandardMaterial color="#16c7f9" emissive="#04384a" roughness={0.32} metalness={0.18} transparent opacity={0.82} />
          </mesh>
          <mesh position={[0.72, 0, 0]}>
            <sphereGeometry args={[1.35, 48, 48]} />
            <meshStandardMaterial color="#9f7aea" emissive="#261b52" roughness={0.38} metalness={0.16} transparent opacity={0.78} />
          </mesh>
          <mesh position={[0, -0.72, 0.12]} scale={[1.3, 0.56, 0.9]}>
            <sphereGeometry args={[1.1, 48, 48]} />
            <meshStandardMaterial color="#39e6a3" emissive="#073728" roughness={0.34} transparent opacity={0.58} />
          </mesh>
          {[...Array(22)].map((_, i) => {
            const a = (i / 22) * Math.PI * 2;
            const r = 2.15 + (i % 3) * 0.22;
            return (
              <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.35) * 1.15, Math.sin(a) * 0.85]} scale={0.055 + (i % 4) * 0.012}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={i % 2 ? '#fbbf24' : '#67e8f9'} emissive={i % 2 ? '#7c2d12' : '#164e63'} />
              </mesh>
            );
          })}
        </group>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.1} />
    </Canvas>
  );
}

function App() {
  const [page, setPage] = useState('Home');
  const [role, setRole] = useState('Radiologist');
  const [dark, setDark] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [authModal, setAuthModal] = useState(null);

  const route = paths[page] || '/';
  const shell = page !== 'Home';

  const goDashboard = (nextRole = role) => {
    setRole(nextRole);
    setPage(nextRole);
    setAuthModal(null);
  };

  return (
    <div className={dark ? 'app dark' : 'app'}>
      {shell && (
        <Sidebar
          page={page}
          setPage={setPage}
          role={role}
          setRole={goDashboard}
          open={sidebar}
          close={() => setSidebar(false)}
        />
      )}
      <main className={shell ? 'main with-sidebar' : 'main'}>
        {shell && (
          <Topbar
            route={route}
            role={role}
            dark={dark}
            setDark={setDark}
            openSidebar={() => setSidebar(true)}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.34, ease: 'easeOut' }}
          >
            {page === 'Home' && <LandingPage setAuthModal={setAuthModal} />}
            {page === 'Radiologist' && <RadiologistDashboard setPage={setPage} />}
            {page === 'Doctor' && <DoctorDashboard setPage={setPage} />}
            {page === 'Admin' && <AdminDashboard />}
            {page === 'Technician' && <TechnicianDashboard setPage={setPage} />}
            {page === 'Patient' && <PatientDashboard setPage={setPage} />}
            {page === 'Upload' && <UploadPage />}
            {page === 'History' && <PatientHistory />}
            {page === 'Viewer' && <ScanViewer />}
            {page === 'Analysis' && <AnalysisResult />}
            {page === 'Reports' && <ReportsPage />}
            {page === 'Settings' && <SettingsPage />}
            {page === 'Notifications' && <NotificationsPage />}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {authModal && (
            <AuthModal mode={authModal} role={role} setRole={setRole} onAuth={() => goDashboard(role)} setMode={setAuthModal} onClose={() => setAuthModal(null)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AuthModal({ mode, role, setRole, onAuth, setMode, onClose }) {
  const isRegister = mode === 'register';
  return (
    <div className="auth-modal-overlay" onClick={(e) => { if(e.target.className === 'auth-modal-overlay') onClose(); }}>
      <motion.form 
        className="auth-card glass" 
        style={{ margin: 0, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onSubmit={(e) => { e.preventDefault(); onAuth(); }}
      >
        <button type="button" className="auth-close-btn" onClick={onClose}><X size={20}/></button>
        <div className="auth-card-top">
          <div className="form-head">
            <span className="eyebrow">{isRegister ? 'Create secure account' : 'Welcome back'}</span>
            <h2>{isRegister ? 'Create clinical account' : 'Sign in to workspace'}</h2>
            <p>{isRegister ? 'Register a verified hospital user with role permissions.' : 'Use the pre-login credentials or choose a role.'}</p>
          </div>
          <div className="auth-badge"><ShieldCheck size={18} /> HIPAA-ready</div>
        </div>
        <div className="role-pills">
          {roles.map((item) => (
            <button type="button" key={item} className={role === item ? 'active' : ''} onClick={() => setRole(item)}>{item}</button>
          ))}
        </div>
        {isRegister && (
          <>
            <Field label="Full Name" placeholder="Enter full name" />
            <div className="two-col"><Field label="Phone Number" placeholder="Enter phone number" /><Field label="Hospital Name" placeholder="Enter hospital name" /></div>
            <div className="two-col"><Field label="Department" placeholder="Enter department" /><Field label="License ID" placeholder="Enter license ID" /></div>
            <div className="two-col"><Field label="Specialization" placeholder="Enter specialization" /><Field label="Experience" placeholder="Enter experience" /></div>
            <label className="field">
              <span>Profile Photo (Optional)</span>
              <input type="file" accept="image/*" style={{padding: '8px 10px', minHeight: 'auto'}} />
            </label>
          </>
        )}
        <Field label="Email" type="email" placeholder="Enter email" defaultValue="demo@medivision.ai" />
        <Field label="Password" type="password" placeholder="password" defaultValue="demo123" />
        {isRegister && (
          <>
            <Field label="Confirm Password" type="password" placeholder="password" />
            <div className="strength"><span style={{ width: '76%' }} /> Strong password</div>
          </>
        )}
        <label className="field auth-select">
          <span>Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="primary-btn" style={{marginTop: 8}} type="submit"><LogIn size={18} /> {isRegister ? 'Create Account' : 'Login'}</button>
        <div className="auth-actions">
          <button type="button" onClick={() => setMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Already registered?' : 'Register'}</button>
          {!isRegister && <button type="button">Forgot Password</button>}
          <button type="button" onClick={onAuth}>Continue</button>
        </div>
      </motion.form>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function Sidebar({ page, setPage, role, setRole, open, close }) {
  const roleNavItems = {
    Radiologist: [
      ['Radiologist', Home], ['Upload', Upload], ['Viewer', Layers3], 
      ['Analysis', Brain], ['Reports', FileText], ['Notifications', Bell], ['Settings', Settings]
    ],
    Doctor: [
      ['Doctor', Stethoscope], ['History', History], ['Viewer', Layers3], 
      ['Analysis', Brain], ['Reports', FileText], ['Notifications', Bell], ['Settings', Settings]
    ],
    Admin: [
      ['Admin', UserCog], ['Notifications', Bell], ['Settings', Settings]
    ],
    Technician: [
      ['Technician', Camera], ['Upload', Upload], ['Notifications', Bell], ['Settings', Settings]
    ],
    Patient: [
      ['Patient', Users], ['History', History], ['Reports', FileText], ['Settings', Settings]
    ]
  };

  const items = roleNavItems[role] || roleNavItems['Radiologist'];

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`} style={{display: 'flex', flexDirection: 'column'}}>
        <div className="brand-mini"><Brain size={24} /> <span>MediVision AI</span></div>
        <div className="role-badge" style={{padding: '0 24px', marginBottom: 16, fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700}}>
          {role} Workspace
        </div>
        <nav style={{flex: 1}}>
          {items.map(([name, Icon]) => (
            <button key={name} className={page === name ? 'active' : ''} onClick={() => { setPage(name); close(); }}>
              <Icon size={18} /><span>{name === role ? 'Dashboard' : name}</span>
            </button>
          ))}
        </nav>
        <div style={{padding: 24}}>
          <button className="secondary-btn" style={{width: '100%', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center'}} onClick={() => { setPage('Home'); close(); }}>
            <LogIn size={16} /> Sign Out
          </button>
        </div>
      </aside>
      {open && <button className="scrim" onClick={close} aria-label="Close sidebar" />}
    </>
  );
}

function Topbar({ route, role, dark, setDark, openSidebar }) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={openSidebar}><Menu size={20} /></button>
      <div>
        <span className="eyebrow">{route}</span>
        <h2>{role} Workspace</h2>
      </div>
      <div className="search-box"><Search size={18} /><input placeholder="Search patients, scans, reports" /></div>
      <button className="icon-btn" onClick={() => setDark(!dark)}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
      <button className="icon-btn"><Bell size={19} /><i /></button>
    </header>
  );
}

function StatCard({ icon: Icon, label, value, tone = 'cyan', sub }) {
  return (
    <motion.div className={`stat-card ${tone}`} whileHover={{ y: -4, scale: 1.01 }}>
      <div className="stat-icon"><Icon size={22} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </motion.div>
  );
}

function RadiologistDashboard({ setPage }) {
  return (
    <div className="page-grid">
      <section className="hero-workbench home-hero glass">
        <div>
          <span className="eyebrow">AI-assisted diagnosis workflow</span>
          <h1>Radiology command center</h1>
          <p>One screen for emergency triage, modality queues, AI evidence, heatmap review, report approval, and collaboration with doctors.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setPage('Upload')}><Upload size={18} /> Upload Scan</button>
            <button className="secondary-btn" onClick={() => setPage('Viewer')}><Eye size={18} /> Open Viewer</button>
          </div>
          <div className="hero-metrics">
            <span><b>0</b> critical alerts</span>
            <span><b>0</b> pending reviews</span>
            <span><b>0</b> second opinions</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-canvas"><BrainModel /></div>
          <div className="floating-diagnosis">
            <span className="status-pill green">Ready</span>
            <strong>No active scan</strong>
            <small>Upload a scan to begin analysis.</small>
          </div>
        </div>
      </section>
      <section className="home-strip">
        {[
          ['CT', 'Brain, chest, and trauma workflows', 'No scans yet', Brain],
          ['MRI', 'Soft tissue and spine workflows', 'No scans yet', Activity],
          ['X-Ray', 'Chest and skeletal workflows', 'No scans yet', HeartPulse],
          ['Orthopedic Imaging', 'Fracture and joint workflows', 'No scans yet', Layers3]
        ].map(([title, body, meta, Icon]) => (
          <motion.button className="modality-tile" key={title} whileHover={{ y: -4 }} onClick={() => setPage('Viewer')}>
            <Icon size={22} />
            <strong>{title}</strong>
            <span>{body}</span>
            <small>{meta}</small>
          </motion.button>
        ))}
      </section>
      <div className="stats-grid">
        <StatCard icon={Activity} label="Scans Today" value="0" />
        <StatCard icon={ClipboardList} label="Pending Review" value="0" tone="violet" />
        <StatCard icon={AlertTriangle} label="Critical Alerts" value="0" tone="red" />
        <StatCard icon={CheckCircle2} label="AI Accuracy" value="N/A" tone="green" />
        <StatCard icon={FileText} label="Reports Generated" value="0" tone="amber" />
      </div>
      <section className="content-grid">
        <ScanQueue title="Emergency Alerts" />
        <AIAnalysisPanel />
        <ReportGenerator />
      </section>
      <section className="home-deep-grid">
        <Panel title="Live AI Pipeline" icon={Zap}>
          <div className="pipeline">
            {[
              ['Input', 'Awaiting scan upload'],
              ['Preprocess', 'Ready to prepare imaging data'],
              ['Inference', 'Ready to run model analysis'],
              ['Output', 'Report output will appear after analysis']
            ].map(([step, text], index) => (
              <div className="pipeline-step" key={step}>
                <span>{index + 1}</span>
                <div><strong>{step}</strong><small>{text}</small></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Clinical Handoff & AI Voice Assistant" icon={Stethoscope}>
          <div className="handoff">
            <div><strong>No active handoff</strong><span>Clinical handoff details will appear after a scan is reviewed.</span></div>
            <div><strong>No case history linked</strong><span>Patient history will appear after records are added.</span></div>
          </div>
          <div className="voice-assistant glass" style={{padding: 16, borderRadius: 8, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', marginTop: 16}}>
            <div style={{display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12}}>
               <div className="stat-icon bg-cyan" style={{width: 32, height: 32}}><Mic size={16} /></div>
               <div><strong className="text-cyan">Voice Assistant Ready</strong><div style={{fontSize: '0.8rem', opacity: 0.8}}>Ask a question after analysis is available.</div></div>
            </div>
            <div style={{padding: 12, background: 'rgba(2, 6, 23, 0.4)', borderRadius: 8, fontSize: '0.9rem'}}>
               <p style={{margin: 0, color: '#ecf7ff'}}><em>No analysis summary is available yet.</em></p>
            </div>
          </div>
        </Panel>
        <Panel title="Today by Modality" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.18)" />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip />
              <Bar dataKey="value" fill="#67e8f9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </section>
    </div>
  );
}

function DoctorDashboard({ setPage }) {
  return (
    <div className="page-grid">
      <div className="stats-grid four">
        <StatCard icon={Users} label="Patients Today" value="0" />
        <StatCard icon={FileText} label="Reports Pending" value="0" tone="amber" />
        <StatCard icon={AlertTriangle} label="Critical Cases" value="0" tone="red" />
        <StatCard icon={Mic} label="Consultations" value="0" tone="violet" />
      </div>
      <section className="content-grid two">
        <Panel title="Patient Search & Compare" icon={Search}>
          <div className="search-xl" style={{marginBottom: 16}}><Search size={20} /><input placeholder="Patient ID, name, or date" /></div>
          <ScanQueue compact />
          <div style={{marginTop: 16}}>
            <strong>Patient Comparison</strong>
            <p style={{fontSize: '0.85rem', color: '#64748b', margin: '4px 0 12px'}}>Compare scans after patient imaging records are added.</p>
            <div className="button-row"><button className="secondary-btn" style={{width: '100%'}} onClick={() => setPage('Viewer')}><Layers3 size={16}/> Open Viewer</button></div>
          </div>
        </Panel>
        <Panel title="Clinical Decision Support" icon={Stethoscope}>
          <AIAnalysisPanel compact />
          <div style={{marginTop: 16}}>
            <textarea placeholder="Doctor comments and clinical notes" style={{minHeight: 80, marginBottom: 12}} />
            <textarea placeholder="Prescription / Treatment Recommendation (Optional AI assisted)" style={{minHeight: 80, marginBottom: 16}} />
          </div>
          <div className="button-row">
            <button className="primary-btn"><Sparkles size={16} /> AI Treatment Suggestion</button>
            <button className="secondary-btn" onClick={() => setPage('Reports')}>Request Radiologist 2nd Opinion</button>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="page-grid">
      <div className="stats-grid four">
        <StatCard icon={Users} label="Total Users" value="0" />
        <StatCard icon={Cloud} label="Scans Processed" value="0" tone="green" />
        <StatCard icon={Brain} label="AI Usage" value="N/A" tone="violet" />
        <StatCard icon={AlertTriangle} label="False Positives" value="N/A" tone="amber" />
      </div>
      <section className="content-grid two">
        <Panel title="Platform Analytics" icon={BarChart3}>
          <ChartBlock />
        </Panel>
        <Panel title="Model Monitoring" icon={Activity}>
          <MetricRow label="Model version" value="Not configured" />
          <MetricRow label="Accuracy" value="N/A" />
          <MetricRow label="Inference latency" value="N/A" />
          <MetricRow label="Error logs" value="0" />
          <MetricRow label="Storage usage" value="0%" />
        </Panel>
        <Panel title="User & Hospital Management" icon={UserCog}>
          <div style={{marginBottom: 16}}>
            <strong>User Roles</strong>
            {['Doctors', 'Radiologists', 'Technicians', 'Admins'].map((item, index) => (
              <MetricRow key={item} label={item} value="0 active" />
            ))}
          </div>
          <div className="button-row"><button className="secondary-btn" style={{flex: 1}}>Manage Departments</button><button className="secondary-btn" style={{flex: 1}}>Manage Branches</button></div>
        </Panel>
        <Panel title="Audit Logs & Feedback" icon={ShieldCheck}>
          <div style={{marginBottom: 16}}>
            <strong>Recent Audit Logs</strong>
            <EmptyState message="No audit logs yet." />
          </div>
          <div className="button-row"><button className="secondary-btn" style={{width: '100%'}}>Review User Feedback</button></div>
        </Panel>
      </section>
    </div>
  );
}

function TechnicianDashboard({ setPage }) {
  return (
    <div className="page-grid">
      <div className="stats-grid four">
        <StatCard icon={Upload} label="Uploaded" value="0" />
        <StatCard icon={Zap} label="Analyzing" value="0" tone="amber" />
        <StatCard icon={CheckCircle2} label="Complete" value="0" tone="green" />
        <StatCard icon={AlertTriangle} label="Errors" value="0" tone="red" />
      </div>
      <section className="content-grid two">
        <Panel title="Upload Patient Scans" icon={Camera}><UploadForm /></Panel>
        <Panel title="Scan Queue" icon={ClipboardList}><ScanQueue compact /><button className="primary-btn" onClick={() => setPage('Upload')}>Open Upload Center</button></Panel>
      </section>
    </div>
  );
}

function PatientDashboard({ setPage }) {
  return (
    <div className="page-grid">
      <section className="hero-workbench home-hero glass" style={{minHeight: 'auto', padding: 32}}>
        <div>
          <span className="eyebrow">Patient Portal</span>
          <h1 style={{fontSize: '2.5rem', margin: '8px 0'}}>Patient Portal</h1>
          <p>Access your medical imaging reports, view your health timeline, and securely communicate with your doctors.</p>
        </div>
      </section>
      <div className="stats-grid four">
        <StatCard icon={FileText} label="Available Reports" value="0" tone="cyan" />
        <StatCard icon={Layers3} label="Scan History" value="0" tone="violet" />
        <StatCard icon={CalendarDays} label="Appointments" value="0" tone="amber" />
        <StatCard icon={Activity} label="Health Status" value="N/A" tone="green" />
      </div>
      <section className="content-grid two">
        <Panel title="My Imaging Reports" icon={FileText}>
          {scans.length === 0 && <EmptyState message="No imaging reports yet." />}
          {scans.map(scan => (
            <div key={scan.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)', alignItems: 'center'}}>
              <div><strong>{scan.type} - {scan.body}</strong><br/><small style={{color: '#64748b'}}>{scan.id}</small></div>
              <div style={{display: 'flex', gap: 8}}>
                <button className="secondary-btn" style={{padding: '6px 12px', minHeight: 'auto'}} onClick={() => setPage('Viewer')}><Eye size={14}/> View</button>
                <button className="secondary-btn" style={{padding: '6px 12px', minHeight: 'auto'}}><Download size={14}/> PDF</button>
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="AI Health Explanation" icon={Sparkles}>
          <div className="glass" style={{padding: 16, borderRadius: 8, background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
            <h3 style={{marginTop: 0, color: '#8b5cf6'}}>Simplified Report</h3>
            <p style={{fontSize: '0.95rem', lineHeight: 1.6}}>No patient-facing report explanation is available yet.</p>
          </div>
          <div className="button-row" style={{marginTop: 16}}>
             <button className="primary-btn"><CalendarDays size={16}/> Book Consultation</button>
             <button className="secondary-btn"><Mail size={16}/> Message Doctor</button>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function UploadPage() {
  return (
    <div className="page-grid">
      <Panel title="Scan Upload Module" icon={Upload}><UploadForm full /></Panel>
    </div>
  );
}

function UploadForm({ full }) {
  return (
    <form className="upload-form">
      <div className="two-col"><Field label="Patient ID" placeholder="Enter patient ID" /><Field label="Patient Name" placeholder="Enter patient name" /></div>
      <div className="three-col"><Field label="Age" placeholder="Enter age" /><label className="field"><span>Gender</span><select><option>Male</option><option>Female</option><option>Other</option></select></label><label className="field"><span>Scan Type</span><select><option>CT</option><option>MRI</option><option>X-Ray</option></select></label></div>
      <div className="two-col"><Field label="Body Part" placeholder="Enter body part" /><Field label="Symptoms" placeholder="Enter symptoms" /></div>
      <label className="dropzone">
        <Upload size={28} />
        <strong>Drop DICOM, PNG, JPG, or NIfTI files</strong>
        <span>Heatmap and segmentation preview will be generated after upload.</span>
        <input type="file" multiple />
      </label>
      {full && <textarea placeholder="Technician notes" />}
      <button className="primary-btn" type="button"><Sparkles size={18} /> Start AI Analysis</button>
    </form>
  );
}

function ScanViewer() {
  const [tab, setTab] = useState('CT');
  return (
    <div className="viewer-layout">
      <Panel title="Multi-Scan Viewer" icon={Layers3}>
        <div className="tabs">{['CT', 'MRI', 'X-Ray'].map((t) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
        <div className="scan-stage">
          <div className="scan-image">
            <span className="scan-ring one" />
            <span className="scan-ring two" />
            <span className="scan-hotspot" />
            <strong>{tab} Viewer</strong>
          </div>
          <div className="heatmap-panel">
            <h3>Segmentation Overlay</h3>
            <div className="heatbar"><span /></div>
            <MetricRow label="Zoom" value="100%" />
            <MetricRow label="Brightness" value="0" />
            <MetricRow label="Contrast" value="0" />
            <MetricRow label="Slice" value="N/A" />
          </div>
        </div>
        <div className="button-row"><button className="secondary-btn">Zoom</button><button className="secondary-btn">Compare</button><button className="secondary-btn">Fullscreen</button></div>
      </Panel>
    </div>
  );
}

function AnalysisResult() {
  return (
    <div className="page-grid">
      <section className="content-grid two">
        <AIAnalysisPanel />
        <ReportGenerator />
      </section>
    </div>
  );
}

function PatientHistory() {
  return (
    <div className="page-grid">
      <Panel title="Patient History Timeline" icon={History}>
        <div className="timeline">
          <EmptyState message="No patient history yet." />
        </div>
      </Panel>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="page-grid">
      <ReportGenerator wide />
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page-grid">
      <Panel title="System Settings" icon={Settings}>
        {['Email reports', 'Critical alert notifications', 'Cloud backup', 'Role permissions', 'Language selector', 'Session timeout'].map((item) => (
          <label className="toggle-row" key={item}><span>{item}</span><input type="checkbox" defaultChecked /></label>
        ))}
      </Panel>
    </div>
  );
}

function NotificationsPage() {
  return (
    <div className="page-grid">
      <Panel title="Alert Center" icon={Bell}>
        <EmptyState message="No notifications yet." />
      </Panel>
    </div>
  );
}

function AIAnalysisPanel({ compact }) {
  return (
    <Panel title="AI Analysis Panel" icon={Brain} compact={compact}>
      <div className="prediction-card">
        <span className="status-pill green">Ready</span>
        <h3>No analysis available.</h3>
        <p>Upload a scan and start analysis to generate findings, confidence, severity, and reasoning.</p>
      </div>
      <MetricRow label="Prediction" value="N/A" />
      <MetricRow label="Confidence" value="N/A" />
      <MetricRow label="Severity" value="N/A" />
      <MetricRow label="AI reasoning" value="N/A" />
    </Panel>
  );
}

function ReportGenerator({ wide }) {
  return (
    <Panel title="AI Report Generator" icon={FileText} className={wide ? 'wide' : ''}>
      <div className="report">
        <h3>Findings</h3>
        <p>No findings generated yet.</p>
        <h3>Impression</h3>
        <p>No impression generated yet.</p>
        <h3>Recommendations</h3>
        <p>No recommendations generated yet.</p>
        <h3>Urgency</h3>
        <p><strong>N/A</strong></p>
      </div>
      <div className="button-row">
        <button className="secondary-btn">Edit Report</button>
        <button className="primary-btn"><CheckCircle2 size={18} /> Approve</button>
        <button className="secondary-btn"><Download size={18} /> PDF</button>
        <button className="secondary-btn"><Share2 size={18} /> Share</button>
      </div>
    </Panel>
  );
}

function ScanQueue({ title = 'Scan Queue', compact }) {
  return (
    <Panel title={title} icon={AlertTriangle} compact={compact}>
      <div className="scan-list">
        {scans.length === 0 && <EmptyState message="No scans in the queue." />}
        {scans.map((scan) => (
          <div className="scan-row" key={scan.id}>
            <span className={`severity ${scan.severity.toLowerCase()}`} />
            <div><strong>{scan.patient}</strong><small>{scan.id} - {scan.type} - {scan.body}</small></div>
            <b>{scan.confidence}%</b>
            <ChevronRight size={18} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Panel({ title, icon: Icon, children, compact, className = '' }) {
  return (
    <motion.section className={`panel glass ${compact ? 'compact' : ''} ${className}`} whileHover={{ y: -2 }}>
      <div className="panel-head"><h2><Icon size={20} /> {title}</h2><button className="icon-btn"><PanelLeftClose size={18} /></button></div>
      {children}
    </motion.section>
  );
}

function MetricRow({ label, value }) {
  return <div className="metric-row"><span>{label}</span><strong>{value}</strong></div>;
}

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <span>{message}</span>
    </div>
  );
}

function ChartBlock() {
  if (trend.length === 0 && modelBreakdown.length === 0) {
    return <EmptyState message="No analytics data yet." />;
  }

  return (
    <div className="charts">
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={trend}>
          <defs>
            <linearGradient id="scanGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.18)" />
          <XAxis dataKey="day" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Area type="monotone" dataKey="scans" stroke="#00d4ff" fill="url(#scanGradient)" />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie data={modelBreakdown} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={5}>
            {modelBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function LandingPage({ setAuthModal }) {
  return (
    <div className="landing-wrapper">
      <nav className="landing-nav glass">
        <div className="nav-brand"><Brain size={28} className="text-cyan" /> <span>MediVision AI</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#clinical">Clinical Utility</a>
        </div>
        <div className="nav-actions">
          <button className="secondary-btn" onClick={() => setAuthModal('login')}>Sign In</button>
          <button className="primary-btn" onClick={() => setAuthModal('register')}>Get Started <ChevronRight size={16}/></button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="hero-badge"><Sparkles size={16} /> Next-Generation AI Diagnostics</div>
            <h1 className="hero-title">Precision diagnostics at the speed of thought.</h1>
            <p className="hero-subtitle">
              Empower your radiology team with state-of-the-art AI. MediVision analyzes CT, MRI, and X-Ray scans in seconds, highlighting anomalies and triaging critical cases instantly.
            </p>
            <div className="hero-cta">
              <button className="primary-btn huge-btn" onClick={() => setAuthModal('register')}>Get Started <ChevronRight size={20}/></button>
              <button className="secondary-btn huge-btn" onClick={() => setAuthModal('login')}>Sign In</button>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong className="text-cyan">0</strong><span>Active scans</span></div>
              <div className="stat"><strong className="text-violet">0</strong><span>Pending reports</span></div>
              <div className="stat"><strong className="text-green">N/A</strong><span>Accuracy</span></div>
            </div>
          </motion.div>
        </div>
        <div className="hero-3d">
          <div className="model-container">
            <img src="/hero-image.png" alt="AI Medical Analysis" className="hero-image" />
          </div>
          <motion.div className="floating-card top-right glass" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Activity size={20} className="text-cyan" />
            <div>
              <strong>Analysis Ready</strong>
              <span>Upload a scan to begin.</span>
            </div>
          </motion.div>
          <motion.div className="floating-card bottom-left glass" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
            <CheckCircle2 size={20} className="text-green" />
            <div>
              <strong>No Findings Yet</strong>
              <span>Results appear after analysis.</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="landing-features">
        <div className="section-header">
          <span className="eyebrow text-violet">Core Capabilities</span>
          <h2>A complete suite for modern imaging</h2>
          <p>Everything you need to integrate AI into your clinical workflow securely and efficiently.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card glass">
            <div className="feature-icon bg-cyan"><Zap size={24} /></div>
            <h3>Instant Triage</h3>
            <p>Automatically prioritize critical scans in the worklist based on AI findings.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon bg-violet"><Layers3 size={24} /></div>
            <h3>Multimodal Support</h3>
            <p>Seamlessly analyze CT, MRI, and X-Rays across various body parts.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon bg-green"><ShieldCheck size={24} /></div>
            <h3>HIPAA Compliant</h3>
            <p>Bank-grade encryption and strict access controls ensure patient data privacy.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon bg-amber"><FileText size={24} /></div>
            <h3>Auto-Drafted Reports</h3>
            <p>Generate preliminary reports based on AI findings to accelerate final sign-off.</p>
          </div>
        </div>
      </section>
      
      <footer className="landing-footer glass">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-brand"><Brain size={24} className="text-cyan"/> <span>MediVision AI</span></div>
            <p>Transforming radiology with artificial intelligence.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <strong>Product</strong>
              <a href="#features">Features</a>
              <a href="#">Security</a>
              <a href="#">Pricing</a>
            </div>
            <div className="link-group">
              <strong>Company</strong>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-group">
              <strong>Legal</strong>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 MediVision AI Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
