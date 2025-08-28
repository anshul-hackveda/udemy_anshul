import React, { useState, useEffect, useRef } from 'react';

const MainContent = () => {
    // State for accordions
    const [activeSection, setActiveSection] = useState('bank-section');
    const [activeLectures, setActiveLectures] = useState(new Set());

    // State for "Show More" description
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // State for sticky sidebar image visibility
    const [isSidebarImageHidden, setIsSidebarImageHidden] = useState(false);
    const introRef = useRef(null);

    // Effect for Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (window.innerWidth > 992) { // Only run on desktop
                    setIsSidebarImageHidden(!entry.isIntersecting);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (introRef.current) {
            observer.observe(introRef.current);
        }

        return () => {
            if (introRef.current) {
                observer.unobserve(introRef.current);
            }
        };
    }, []);

    const toggleLecture = (lectureId) => {
        setActiveLectures(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lectureId)) {
                newSet.delete(lectureId);
            } else {
                newSet.add(lectureId);
            }
            return newSet;
        });
    };
    
    const lectureData = [
        { id: 1, title: "Mentor Introduction & Experience", duration: "06:24", preview: true, description: ["Devanshu Shukla shares personal journey from engineering to cybersecurity.", "Experience with hacking groups, government projects, DRDO, defense labs, and building AI-based solutions.", "Insights into real tenders and large-scale cybersecurity implementations."] },
        { id: 2, title: "Industry Needs & Course Objectives", duration: "06:09", preview: true, description: ["Discussion on cyber threats, risk registers, forensic analysis, incident response, disaster recovery planning.", "National-level cybersecurity priorities and skills needed for finance, defense, utilities, and e-governance sectors.", "Top skills in demand for cybersecurity analysts based on real job market research."] },
        { id: 3, title: "Real Tender Example: Bank Cybersecurity Project", duration: "21:50", preview: false, description: ["Introduction to Central Bank of India and Union Bank of India tender requirements.", "Scope of work: Application audit, OWASP checks, VAPT, Data Center (DC/DRC) audits, ATM security audits.", "Explanation of real cyberattacks on banks (phishing, malware injections, fraudulent transactions)."] },
        { id: 4, title: "Project Setup: Bank Network Audit Steps", duration: "01:00:40", preview: false, description: ["Defining the first hands-on project: AI-enabled fraud detection & threat prevention system for Union Bank of India.", "Five-step audit methodology:", "Homework: Install NMAP or ZenMap before next session."] },
        { id: 5, title: "Introduction to Bank Network Audit Methodology", duration: "05:56", preview: false, description: ["Recap of previous session and project (Union Bank of India Network Audit).", "Understanding key stages of a bank network audit:", "Real-world objective: Achieve zero blind spots in bank networks, minimize blast radius of attacks."] },
        { id: 6, title: "Preparing the Audit Environment", duration: "10:44", preview: false, description: ["Collecting data from: Asset management tools, Active directories, Network inventories (routers, firewalls, IoT, ATM devices).", "Tools to be used: Nmap (network scanning), Nessus (licensed vulnerability scanner), Traceroute, Wireshark for flow mapping.", "Setting up Intern Tracker account for live tasks and demonstrations."] },
        { id: 7, title: "AWS Lab Setup and Bank Network Architecture", duration: "38:47", preview: false, description: ["Deploying a simulated Union Bank infrastructure on AWS: Virtual Private Cloud (VPC), Internet Gateway and NAT Gateway, Public and private routing tables, Security groups and subnet segmentation.", "Understanding role of the Bastion server.", "Overview of 4 key servers: Branch Server, Payment Gateway, ATM Controller, Database Server."] },
        { id: 8, title: "Network Mapping and Asset Discovery", duration: "38:13", preview: false, description: ["Live demonstration: Using Nmap to scan networks and identify open ports, Detecting services and their software versions, Using SSH to access bastion server remotely, Attempting communication with ports via Ncat.", "Introduction to exploit databases for testing vulnerabilities."] },
        { id: 9, title: "Risk Register, Data Flow, and Traffic Capture", duration: "17:05", preview: false, description: ["Creating an Information Security Register: Asset identification (IP addresses, services), Risks identified (e.g., plain-text FTP communication, outdated software), Recommendations (secure FTP, network segmentation).", "Packet capturing using TCP dump and Wireshark for analyzing data flows.", "Case study: World Bank server breach caused by insider threat and poor security monitoring."] },
        { id: 10, title: "The Billion-Dollar Breach: Why Banks Are Losing Crores to Cyberattacks", duration: "11:29", preview: false, description: ["Real-world breach costing hundreds of crores.", "Recap of Union Bank network audit.", "Today's mission: Build AI-powered firewall.", "Firewalls explained (software, hardware, next-gen).", "Why traditional firewalls fail against modern attacks.", "How AI-powered firewalls detect and stop new threats."] },
        { id: 11, title: "Watch a Live Bank Hack in Action: Brute Force Attack & Firewall Breakdown", duration: "54:36", preview: false, description: ["AWS cloud lab setup (5 bank servers + attacker machine).", "Nmap scan: Finding open ports.", "Hydra brute-force attack simulation.", "Logs exposing firewall weaknesses in real-time."] },
        { id: 12, title: "Building the AI Firewall That Outsmarts Hackers (Live Demo + Industry Secrets)", duration: "40:29", preview: false, description: ["Installing AI-powered defense system (Python, ML libraries).", "Writing anomaly detection rules with Isolation Forest.", "Auto-blocking malicious IPs in real-time.", "Writing brute force & SQL injection threat signatures.", "Static vs adaptive AI signatures.", "Industry relevance (₹80–100 Cr firewall tenders)."] },
        { id: 13, title: "Real-Time AI vs Email Fraud: How to Stop Phishing, Spam & Bank Hacks", duration: "21:09", preview: false, description: ["How email fraud works in banking: spoofing, phishing, malware attachments, and social engineering.", "Training AI models using real transaction logs, phishing emails, and spam patterns for anomaly detection.", "Live demo of setting up a MailHog email server and simulating a fraud attack on Union Bank’s mail system.", "Building an AI-powered spam filter in Python to block phishing and malicious emails in real time.", "Real-world tender breakdown: ₹6.8 lakh project for cloud email security and how this lesson aligns with it.", "Career & business transformation: roles in SOC, DevSecOps, cloud security, and launching email security services."] },
        { id: 14, title: "Live Email Attack vs Intelligent Firewall Defense: Outsmart Hackers with AI", duration: "40:22", preview: false, description: ["Step-by-step setup of MailHog to simulate a cloud-based email server in a controlled lab environment.", "Launching a live email attack: Using an external attacker to send phishing emails to the bank’s mail server.", "Analyzing server behavior with and without AI-based detection: what changes when defense is intelligent.", "Bypassing traditional defenses using tools like Hydra and Burp Suite to test login pages and brute-force attacks.", "Detecting threats in real-time using an Isolation Forest-based AI model for behavioral anomaly detection.", "Blocking malicious IPs automatically using Python scripting – turning raw logs into real-time protection."] },
        { id: 15, title: "Inside the SOC War Room: Deploying SIEM Dashboards & Real-Time Cyber Alerts", duration: "01:08:10", preview: false, description: ["Step-by-step SIEM deployment for centralized log collection and security event monitoring.", "Designing a SOC dashboard to track live security incidents, threat patterns, and KPIs.", "Configuring real-time alerts for brute force attacks, phishing attempts, and policy violations.", "Analyzing and correlating security events across multiple data sources for rapid incident detection.", "Coordinating with stakeholders to share incident reports, escalation procedures, and compliance updates.", "Optimizing SOC performance by tuning alert rules, reducing false positives, and improving response times."] },
        { id: 16, title: "Global Hack Demo: How Attackers Control Your PC from Anywhere in the World", duration: "07:39", preview: false, description: ["Cross-country hacking demo—attacker in the US, victim in Germany.", "Using ncat to gain shell access and run commands like launching apps or browsing data.", "Exploiting the victim’s file system to manipulate files and directories.", "Evading detection by running exploits in sandboxed environments.", "Real-world scenarios of exploiting images or PDFs to gain system access.", "Strategies for quick mitigation once a breach is detected."] },
        { id: 17, title: "Hacking WhatsApp with a GIF: Memory Overflow in Action", duration: "08:17", preview: false, description: ["Exploiting memory stack vulnerabilities via integer overflow in WhatsApp.", "Creating a malicious GIF that delivers a reverse shell to the attacker.", "Real-time attack demonstration between a US cloud server and an Android phone.", "Executing phone commands remotely, including dialing numbers and modifying files.", "Understanding the risks to unrooted Android devices through media-based exploits.", "Security awareness tips for detecting and mitigating mobile device breaches."] }
    ];

    return (
        <>
            {/* Course Intro */}
            <div className="intro" id="courseIntro" ref={introRef}>
                <div className="container">
                    <nav className="breadcrumb">
                        <a href="#">IT & Software</a> <i className="fas fa-chevron-right"></i>
                        <a href="#">Network & Security</a> <i className="fas fa-chevron-right"></i>
                        <span>Cybersecurity</span>
                    </nav>
                    
                    <div className="mobile-only-image">
                        <img src="/course-preview.png" alt="Course Preview" />
                        <div className="play-overlay">
                            <i className="fas fa-play"></i>
                            <span>Preview this course</span>
                        </div>
                    </div>

                    <h1>Cyber Security Course 2025</h1>
                    <p>Equip students and professionals with in-demand skills in digital risk <br /> management and cyber threat defense.</p>
                    <div className="meta">
                        <span className="new-badge">New</span>
                        <span className="rating">0.0 ⭐⭐⭐⭐⭐ (0 ratings)</span>
                        <span>0 students</span>
                    </div>
                    <p>Created by <a href="#">Devanshu Shukla</a></p>
                    <div className="details">
                        <span><i className="far fa-clock"></i> Last updated 8/2025</span>
                        <span><i className="fas fa-globe"></i> English</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main">
                <div className="container">
                    <div className="content">
                        <div className="left">
                            {/* What You'll Learn */}
                            <section className="learn-box">
                                <h2>What you'll learn</h2>
                                <div className="grid">
                                    <div><i className="fas fa-check"></i>Equip students and professionals with in-demand skills in digital risk management and cyber threat defense</div>
                                    <div><i className="fas fa-check"></i>This course prepares learners to secure networks, configure firewalls, and use SIEM tools for proactive threat monitoring</div>
                                    <div><i className="fas fa-check"></i>Develop core competencies in risk register management, root cause analysis, and threat pattern detection</div>
                                    <div><i className="fas fa-check"></i>The program covers security operations, incident response, forensic analysis, disaster recovery planning</div>
                                </div>
                            </section>

                            {/* Course Content */}
                            <section className="curriculum">
                                <h2>Course content</h2>
                                <p>1 section • 17 lectures • 7h 37m total length</p>
                                <div className="accordion">
                                    <div className="section">
                                        <button 
                                          className={`section-btn ${activeSection === 'bank-section' ? 'active' : ''}`} 
                                          onClick={() => setActiveSection(activeSection === 'bank-section' ? null : 'bank-section')}
                                        >
                                            <i className="fas fa-chevron-down"></i>
                                            <span>Union Bank Of India - Fraud Detection & Cyber Threat Prevention System</span>
                                            <span>17 lectures • 7hr 37min</span>
                                        </button>
                                        <div className={`lectures ${activeSection === 'bank-section' ? 'active' : ''}`}>
                                            {lectureData.map(lecture => (
                                                <div className="lecture-item" key={lecture.id}>
                                                    <div 
                                                      className={`lecture expandable ${activeLectures.has(lecture.id) ? 'active' : ''}`} 
                                                      onClick={() => toggleLecture(lecture.id)}
                                                    >
                                                        <div className="lecture-title-container"><i className="far fa-play-circle"></i><span>{lecture.title}</span></div>
                                                        <i className="fas fa-chevron-down lecture-chevron"></i>
                                                        <div className="lecture-meta-container">
                                                            {lecture.preview && <a href="#" className="preview">Preview</a>}
                                                            <span>{lecture.duration}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`lecture-description ${activeLectures.has(lecture.id) ? 'active' : ''}`}>
                                                        {lecture.description.map((line, index) => <p key={index}>{line}</p>)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                             {/* Requirements */}
                            <section>
                                <h2>Requirements</h2>
                                <ul>
                                    <li>Designed for students, professionals, and public sector employees, the course emphasizes both technical and analytical capabilities required in Security Operations Centers (SOCs), audits, and compliance frameworks.</li>
                                </ul>
                            </section>

                            {/* Description */}
                            <section>
                                <h2>Description</h2>
                                <p>The Cyber Security Course by Hackveda is a focused training program designed to equip students and professionals with in-demand skills in digital risk management and cyber threat defense.</p>
                                <div className={`more-content ${isDescriptionExpanded ? 'active' : ''}`}>
                                    <p>Built on real industry and government sector needs, this course prepares learners to secure networks, configure firewalls, and use SIEM tools for proactive threat monitoring.</p>
                                </div>
                                <button className="show-more" onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                                    {isDescriptionExpanded ? (
                                        <>Show less <i className="fas fa-chevron-up"></i></>
                                    ) : (
                                        <>Show more <i className="fas fa-chevron-down"></i></>
                                    )}
                                </button>
                            </section>

                            {/* Instructor */}
                            <section className="instructor">
                                <h2>Instructor</h2>
                                <a href="#" className="instructor-name">Devanshu Shukla</a>
                                <p className="instructor-title">Director at Hackveda Solutions</p>
                                <div className="instructor-meta">
                                    <img src="/devanshu_sir_image.png" alt="Devanshu Shukla" className="instructor-pic" />
                                    <div className="instructor-stats">
                                        <span><i className="fas fa-star"></i> -- Instructor Rating</span>
                                        <span><i className="fas fa-comment-alt"></i> -- Reviews</span>
                                        <span><i className="fas fa-user-friends"></i> -- Students</span>
                                        <span><i className="fas fa-play-circle"></i> 1 Course</span>
                                    </div>
                                </div>
                                <p className="instructor-tagline">Business Leader by Profession, Software Engineer by Education, Problem Solver by Nature and Computer Hacker by Passion</p>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="sidebar">
                            <div className={`sidebar-image ${isSidebarImageHidden ? 'hidden' : ''}`} id="sidebarImage">
                                <img src="/course-preview.png" alt="Course Preview" />
                                <div className="play-overlay">
                                    <i className="fas fa-play"></i>
                                    <span>Preview this course</span>
                                </div>
                            </div>
                            
                            <div className="course-card">
                                <div className="card-content">
                                    <div className="price">
                                        <span className="current">₹1,769</span>
                                    </div>
                                    <button className="btn-primary">Add to cart</button>
                                    <button className="btn-secondary">Buy now</button>
                                    <p className="guarantee">30-Day Money-Back Guarantee</p>
                                    <div className="includes">
                                        <h3>This course includes:</h3>
                                        <ul>
                                            <li><i className="fas fa-video"></i> 7 hours on-demand video</li>
                                            <li><i className="fas fa-file-download"></i> 5 downloadable resources</li>
                                            <li><i className="fas fa-mobile-alt"></i> Access on mobile and TV</li>
                                            <li><i className="fas fa-infinity"></i> Full lifetime access</li>
                                            <li><i className="fas fa-trophy"></i> Certificate of completion</li>
                                        </ul>
                                    </div>
                                    <div className="links">
                                        <a href="#">Share</a>
                                        <a href="#">Gift this course</a>
                                        <a href="#">Apply Coupon</a>
                                    </div>
                                    <div className="applied-coupon">
                                        <span><strong>KEEPLEARNING</strong> is applied</span>
                                        <span className="udemy-coupon-text">Udemy coupon</span>
                                    </div>
                                    <div className="coupon">
                                        <input id="coupon" placeholder="Enter Coupon" />
                                        <button id="apply">Apply</button>
                                    </div>
                                    <div id="message"></div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
             {/* Mobile Fixed Cart Bar */}
            <div className="mobile-cart-bar">
                <div className="price-container">
                    <span className="current-price">₹1,769</span>
                    <span className="guarantee-mobile">30-Day Money-Back Guarantee</span>
                </div>
                <button className="mobile-add-cart">Add to cart</button>
            </div>
        </>
    );
};

export default MainContent;