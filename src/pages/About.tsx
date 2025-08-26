import React, { useState, useEffect } from "react";
import "./About.css";

interface BloodPressureData {
  systolic: number;
  diastolic: number;
  time: string;
  date: string;
  measureTime: string;
}

interface BloodGlucoseData {
  value: number;
  time: string;
  date: string;
  measureTime: string;
}

interface HealthData {
  bloodPressure: BloodPressureData[];
  bloodGlucose: BloodGlucoseData[];
  medications: any[];
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="modal"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content">
        <div className="modal-title">{title}</div>
        <div
          className="modal-message"
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br>") }}
        />
        <div className="modal-buttons">
          <button className="btn-modal btn-confirm" onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

const HealthApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [healthData, setHealthData] = useState<HealthData>({
    bloodPressure: [],
    bloodGlucose: [],
    medications: [],
  });

  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    glucose: "",
    measureTime: "空腹",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "提示",
    message: "",
    onConfirm: undefined as (() => void) | undefined,
  });

  const [medicationStatus, setMedicationStatus] = useState<{
    [key: number]: "taken" | "skipped" | null;
  }>({});

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = () => {
    try {
      const saved = localStorage.getItem("healthData");
      if (saved) {
        setHealthData(JSON.parse(saved));
      } else {
        generateSampleData();
      }
    } catch (error) {
      console.error("Failed to load health data:", error);
      generateSampleData();
    }
  };

  const saveHealthData = (data: HealthData) => {
    try {
      localStorage.setItem("healthData", JSON.stringify(data));
      setHealthData(data);
    } catch (error) {
      console.error("Failed to save health data:", error);
    }
  };

  const generateSampleData = () => {
    const newHealthData: HealthData = {
      bloodPressure: [],
      bloodGlucose: [],
      medications: [],
    };

    // 生成一周的模拟血压数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      newHealthData.bloodPressure.push({
        systolic: 115 + Math.floor(Math.random() * 30),
        diastolic: 75 + Math.floor(Math.random() * 20),
        time: "08:30",
        date: date.toDateString(),
        measureTime: "空腹",
      });
    }

    // 生成一周的模拟血糖数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      newHealthData.bloodGlucose.push({
        value: 5.5 + Math.random() * 3,
        time: "08:00",
        date: date.toDateString(),
        measureTime: "空腹",
      });
    }

    saveHealthData(newHealthData);
  };

  const switchTab = (tabName: string) => {
    setCurrentTab(tabName);
  };

  const saveData = () => {
    const { systolic, diastolic, glucose, measureTime } = formData;

    if (!systolic && !diastolic && !glucose) {
      showModal("请输入至少一项数据", "输入提示");
      return;
    }

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const newHealthData = { ...healthData };

    if (systolic && diastolic) {
      newHealthData.bloodPressure.push({
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        time: timeStr,
        date: now.toDateString(),
        measureTime: measureTime,
      });
    }

    if (glucose) {
      newHealthData.bloodGlucose.push({
        value: parseFloat(glucose),
        time: timeStr,
        date: now.toDateString(),
        measureTime: measureTime,
      });
    }

    setFormData({
      systolic: "",
      diastolic: "",
      glucose: "",
      measureTime: "空腹",
    });

    saveHealthData(newHealthData);
    showModal("数据保存成功！", "保存成功");
  };

  const showModal = (
    message: string,
    title: string = "提示",
    onConfirm?: () => void
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false, onConfirm: undefined }));
  };

  const takeMedication = (index: number) => {
    setMedicationStatus((prev) => ({ ...prev, [index]: "taken" }));
    showModal("用药记录已保存", "用药提醒");
  };

  const skipMedication = (index: number, medName: string) => {
    showModal(`确定要跳过 ${medName} 吗？`, "跳过用药", () => {
      setMedicationStatus((prev) => ({ ...prev, [index]: "skipped" }));
    });
  };

  const enterRoom = (roomType: string) => {
    const roomNames: { [key: string]: string } = {
      screening: "风险筛查区",
      monitoring: "诊断监测区",
      treatment: "药物治疗区",
      lifestyle: "生活干预区",
      complications: "并发症防护区",
      emergency: "急救处理区",
    };

    const roomDescriptions: { [key: string]: string } = {
      screening:
        "这里有高血压风险自测问卷、基因检测盒、BMI测量工具等。通过科学的风险评估，帮您及早发现疾病征象。",
      monitoring:
        "配备各种血压计、血糖仪等监测设备，模拟家庭场景，教您正确的测量方法和数据管理。",
      treatment:
        "按病理阶段分层陈列药物，包括一线治疗、联合用药、顽固性高血压用药，以及相应的保健品。",
      lifestyle:
        "展示低钠调味品、智能降压勺、有氧运动设备等，帮助您建立健康的生活方式。",
      complications:
        "心脑血管、眼底、肾脏等器官保护产品，通过人体模型演示并发症预防知识。",
      emergency:
        "急救药品和正确处理方法展示，包括突发情况的应对措施和紧急联系方式。",
    };

    showModal(roomDescriptions[roomType], `虚拟导览 - ${roomNames[roomType]}`);
  };

  const openAIAssistant = () => {
    const tips = [
      "根据您最近的血压数据，建议减少盐分摄入，每日不超过5克。",
      "您的血糖波动较大，建议餐后适量运动，有助于血糖稳定。",
      "记得按时服药，可以设置闹钟提醒，提高用药依从性。",
      "定期监测很重要，建议每天同一时间测量血压。",
      "保持良好心情，避免情绪激动，对血压控制很有帮助。",
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    showModal(randomTip, "AI健康助手建议");
  };

  const callEmergency = () => {
    showModal(
      "紧急联系人已通知\n附近医院：\n市人民医院 - 2.3公里\n中心医院 - 3.1公里\n\n如症状严重请立即拨打120！",
      "紧急处理"
    );
  };

  const getLatestBloodPressure = () => {
    return healthData.bloodPressure[healthData.bloodPressure.length - 1];
  };

  const getLatestGlucose = () => {
    return healthData.bloodGlucose[healthData.bloodGlucose.length - 1];
  };

  const getBloodPressureStatus = () => {
    const latest = getLatestBloodPressure();
    if (!latest) return { status: "normal", desc: "暂无数据" };

    if (latest.systolic > 140 || latest.diastolic > 90) {
      return { status: "warning", desc: "血压偏高，请注意休息并咨询医生" };
    }
    return { status: "success", desc: "血压正常，请继续保持" };
  };

  const getGlucoseStatus = () => {
    const latest = getLatestGlucose();
    if (!latest) return { status: "normal", desc: "暂无数据" };

    let isNormal = false;
    if (latest.measureTime === "空腹" && latest.value <= 6.1) {
      isNormal = true;
    } else if (latest.measureTime === "餐后2小时" && latest.value <= 7.8) {
      isNormal = true;
    }

    if (isNormal) {
      return { status: "success", desc: "血糖正常，请继续保持" };
    }
    return {
      status: "warning",
      desc: `${latest.measureTime}血糖偏高，建议咨询医生`,
    };
  };

  const getMedicationProgress = () => {
    const total = 3; // 总药物数量
    const taken = Object.values(medicationStatus).filter(
      (status) => status === "taken"
    ).length;
    return {
      total,
      taken,
      percentage: Math.round((taken / total) * 100),
    };
  };

  const medications = [
    { name: "氨氯地平片", time: "14:30", dosage: "5mg，餐后服用" },
    { name: "二甲双胍缓释片", time: "19:00", dosage: "500mg，晚餐后服用" },
    { name: "阿司匹林肠溶片", time: "21:00", dosage: "100mg，睡前服用" },
  ];

  const rooms = [
    {
      type: "screening",
      icon: "🔍",
      title: "风险筛查区",
      desc: "疾病风险评估、基因检测、BMI测量等筛查工具",
    },
    {
      type: "monitoring",
      icon: "📊",
      title: "诊断监测区",
      desc: "血压计、血糖仪等监测设备，数据管理系统",
    },
    {
      type: "treatment",
      icon: "💊",
      title: "药物治疗区",
      desc: "分层陈列各类药物，个性化用药方案指导",
    },
    {
      type: "lifestyle",
      icon: "🥗",
      title: "生活干预区",
      desc: "营养膳食、运动器械、减压产品体验",
    },
    {
      type: "complications",
      icon: "⚕️",
      title: "并发症防护区",
      desc: "多器官保护产品，并发症早期筛查工具",
    },
    {
      type: "emergency",
      icon: "🚨",
      title: "急救处理区",
      desc: "应急药品、急救指导、紧急联系系统",
    },
  ];

  const latestBP = getLatestBloodPressure();
  const latestGlucose = getLatestGlucose();
  const bpStatus = getBloodPressureStatus();
  const glucoseStatus = getGlucoseStatus();
  const medProgress = getMedicationProgress();

  return (
    <div className="container">
      <header className="header">
        <h1>健康管理专家</h1>
        <p>您的随身疾病管理助手</p>
      </header>

      <nav className="nav-tabs">
        {[
          { key: "dashboard", label: "首页" },
          { key: "data", label: "数据" },
          { key: "medication", label: "用药" },
          { key: "rooms", label: "样板间" },
          { key: "emergency", label: "急救" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`nav-tab ${currentTab === tab.key ? "active" : ""}`}
            onClick={() => switchTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {/* 首页面板 */}
        {currentTab === "dashboard" && (
          <section className="section active">
            <div className="dashboard">
              <div className={`status-card ${bpStatus.status}`}>
                <div className="status-header">
                  <span className="status-title">血压状态</span>
                  <span className="status-time">
                    {latestBP ? `今天 ${latestBP.time}` : "暂无数据"}
                  </span>
                </div>
                <div className={`status-value ${bpStatus.status}`}>
                  {latestBP
                    ? `${latestBP.systolic}/${latestBP.diastolic}`
                    : "--/--"}
                </div>
                <div className="status-desc">{bpStatus.desc}</div>
              </div>

              <div className={`status-card ${glucoseStatus.status}`}>
                <div className="status-header">
                  <span className="status-title">血糖状态</span>
                  <span className="status-time">
                    {latestGlucose ? `今天 ${latestGlucose.time}` : "暂无数据"}
                  </span>
                </div>
                <div className={`status-value ${glucoseStatus.status}`}>
                  {latestGlucose ? latestGlucose.value.toFixed(1) : "--"}
                </div>
                <div className="status-desc">{glucoseStatus.desc}</div>
              </div>

              <div className="status-card">
                <div className="status-header">
                  <span className="status-title">今日用药</span>
                  <span className="status-time">
                    {medProgress.taken}/{medProgress.total} 已服用
                  </span>
                </div>
                <div className="status-value">{medProgress.percentage}%</div>
                <div className="status-desc">
                  {medProgress.taken === medProgress.total
                    ? "今日用药完成！"
                    : `还有${medProgress.total - medProgress.taken}次用药提醒`}
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <button className="action-btn" onClick={() => switchTab("data")}>
                记录数据
              </button>
              <button
                className="action-btn"
                onClick={() => switchTab("medication")}
              >
                查看用药
              </button>
              <button className="action-btn" onClick={() => switchTab("rooms")}>
                虚拟导览
              </button>
              <button className="action-btn" onClick={openAIAssistant}>
                AI助手
              </button>
            </div>
          </section>
        )}

        {/* 数据记录 */}
        {currentTab === "data" && (
          <section className="section active">
            <div className="chart-container">
              <h3 style={{ marginBottom: "15px", color: "#333" }}>
                血压趋势（7天）
              </h3>
              <div className="chart">
                {[60, 85, 70, 65, 55, 90, 60].map((height, index) => (
                  <div
                    key={index}
                    className={`chart-bar ${height > 80 ? "high" : ""}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="data-form">
              <h3 style={{ marginBottom: "20px", color: "#333" }}>记录数据</h3>

              <div className="form-group">
                <label className="form-label">血压 (mmHg)</label>
                <div className="form-row">
                  <input
                    type="number"
                    className="form-input"
                    placeholder="收缩压"
                    value={formData.systolic}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        systolic: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="舒张压"
                    value={formData.diastolic}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        diastolic: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">血糖 (mmol/L)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="请输入血糖值"
                  step="0.1"
                  value={formData.glucose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      glucose: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">测量时间</label>
                <select
                  className="form-input"
                  value={formData.measureTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      measureTime: e.target.value,
                    }))
                  }
                >
                  <option>空腹</option>
                  <option>餐前</option>
                  <option>餐后2小时</option>
                  <option>睡前</option>
                </select>
              </div>

              <button className="btn-primary" onClick={saveData}>
                保存数据
              </button>
            </div>
          </section>
        )}

        {/* 用药管理 */}
        {currentTab === "medication" && (
          <section className="section active">
            <div className="medication-list">
              {medications.map((med, index) => (
                <div
                  key={index}
                  className={`medication-card ${
                    medicationStatus[index] === "taken"
                      ? ""
                      : medicationStatus[index] === "skipped"
                      ? "overdue"
                      : "due"
                  }`}
                >
                  <div className="med-header">
                    <span className="med-name">{med.name}</span>
                    <span className="med-time">{med.time}</span>
                  </div>
                  <div className="med-dosage">{med.dosage}</div>
                  <div className="med-actions">
                    {medicationStatus[index] === "taken" ? (
                      <span style={{ color: "#51cf66", fontWeight: 600 }}>
                        ✓ 已服用
                      </span>
                    ) : medicationStatus[index] === "skipped" ? (
                      <span style={{ color: "#ff6b6b" }}>已跳过</span>
                    ) : (
                      <>
                        <button
                          className="btn-small btn-taken"
                          onClick={() => takeMedication(index)}
                        >
                          已服用
                        </button>
                        <button
                          className="btn-small btn-skip"
                          onClick={() => skipMedication(index, med.name)}
                        >
                          跳过
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 虚拟样板间 */}
        {currentTab === "rooms" && (
          <section className="section active">
            <div className="sample-rooms">
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="room-card"
                  onClick={() => enterRoom(room.type)}
                >
                  <div className="room-image">{room.icon}</div>
                  <div className="room-content">
                    <div className="room-title">{room.title}</div>
                    <div className="room-desc">{room.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 急救指导 */}
        {currentTab === "emergency" && (
          <section className="section active">
            <div className="emergency-card">
              <div className="emergency-title">紧急情况处理</div>
              <p>如遇血压急剧升高或血糖异常</p>
              <button className="emergency-btn" onClick={callEmergency}>
                一键急救
              </button>
            </div>

            <div className="data-form">
              <h3 style={{ marginBottom: "15px", color: "#333" }}>急救指导</h3>
              <ul className="tips-list">
                <li className="tip-item">
                  <strong>高血压急症：</strong>
                  立即坐下或半卧，保持安静，避免剧烈活动，必要时服用硝苯地平舌下片
                </li>
                <li className="tip-item">
                  <strong>低血糖反应：</strong>
                  立即进食含糖食物（葡萄糖片、糖果等），休息15分钟后复查血糖
                </li>
                <li className="tip-item">
                  <strong>高血糖昏迷：</strong>
                  保持呼吸道通畅，立即拨打120，不要给患者进食任何东西
                </li>
                <li className="tip-item">
                  <strong>胸痛胸闷：</strong>
                  立即停止活动，舌下含服硝酸甘油，如症状未缓解立即就医
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default HealthApp;
