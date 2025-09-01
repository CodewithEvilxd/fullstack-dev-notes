# Security Architecture and Best Practices

## Overview
Security architecture is the design of systems to protect against threats while maintaining functionality, performance, and usability. This guide covers comprehensive security patterns and practices for system design.

## Core Security Principles

### 1. Defense in Depth
```
┌─────────────────────────────────────┐
│         Perimeter Security          │ ← Network firewalls, DDoS protection
├─────────────────────────────────────┤
│       Application Security          │ ← Input validation, authentication
├─────────────────────────────────────┤
│         Data Security               │ ← Encryption, access controls
├─────────────────────────────────────┤
│       Infrastructure Security       │ ← OS hardening, monitoring
└─────────────────────────────────────┘
```

Multiple layers of security controls ensure that if one layer fails, others provide protection.

### 2. Zero Trust Architecture
```
Traditional: Trust internal network
Zero Trust: Never trust, always verify

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│  Identity   │───▶│  Access     │
│   Request   │    │  Verification│    │  Control   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Continuous  │    │  Context    │    │  Least      │
│ Monitoring  │    │  Aware      │    │  Privilege  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 3. Principle of Least Privilege
- Users and systems should have minimum permissions required
- Regular permission audits and cleanup
- Just-in-time access for elevated privileges

## Authentication Patterns

### 1. Multi-Factor Authentication (MFA)
```
Knowledge Factor: Something you know (password)
Possession Factor: Something you have (phone, hardware token)
Inherence Factor: Something you are (biometric)
```

### 2. OAuth 2.0 Authorization Framework
```
┌─────────┐    ┌─────────────┐    ┌─────────┐
│ Client  │───▶│Authorization│───▶│Resource │
│         │    │  Server     │    │ Owner   │
└─────────┘    └─────────────┘    └─────────┘
      ▲               │               │
      │               ▼               │
      │        ┌─────────────┐        │
      │        │  Resource   │        │
      └───────▶│   Server    │◀───────┘
               └─────────────┘
```

### 3. JWT (JSON Web Tokens)
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user123",
    "iat": 1516239022,
    "exp": 1516242622,
    "roles": ["user", "admin"]
  },
  "signature": "base64-encoded-signature"
}
```

### 4. SAML (Security Assertion Markup Language)
```xml
<saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
  <saml:Subject>
    <saml:NameID>user@example.com</saml:NameID>
  </saml:Subject>
  <saml:Conditions>
    <saml:AudienceRestriction>
      <saml:Audience>https://app.example.com</saml:Audience>
    </saml:AudienceRestriction>
  </saml:Conditions>
</saml:Assertion>
```

## Authorization Patterns

### 1. Role-Based Access Control (RBAC)
```
User → Role → Permissions
├── Admin: CREATE, READ, UPDATE, DELETE
├── Editor: READ, UPDATE
└── Viewer: READ
```

### 2. Attribute-Based Access Control (ABAC)
```
Subject + Resource + Action + Environment → Decision

Subject: user.role = "manager"
Resource: document.classification = "confidential"
Action: "read"
Environment: time between 9AM-5PM
Result: ALLOW
```

### 3. Policy-Based Access Control
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:user/*"},
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*",
      "Condition": {
        "IpAddress": {"aws:SourceIp": "192.168.1.0/24"},
        "DateGreaterThan": {"aws:CurrentTime": "2024-01-01T00:00:00Z"}
      }
    }
  ]
}
```

## Data Security

### 1. Encryption at Rest
```python
# AES-256 Encryption
from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt data
encrypted_data = cipher.encrypt(b"sensitive data")

# Decrypt data
decrypted_data = cipher.decrypt(encrypted_data)
```

### 2. Encryption in Transit
```nginx
# SSL/TLS Configuration
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:...;
    ssl_prefer_server_ciphers off;
}
```

### 3. Data Classification
```
┌─────────────────────────────────────┐
│         Public Data                 │ ← No restrictions
├─────────────────────────────────────┤
│       Internal Data                 │ ← Company-only access
├─────────────────────────────────────┤
│     Confidential Data               │ ← Need-to-know basis
├─────────────────────────────────────┤
│   Restricted/Sensitive Data         │ ← Strict controls
└─────────────────────────────────────┘
```

## Network Security

### 1. Network Segmentation
```
┌─────────────────────────────────────┐
│           Public Zone               │ ← Web servers, load balancers
├─────────────────────────────────────┤
│         DMZ (Demilitarized Zone)     │ ← Application servers
├─────────────────────────────────────┤
│        Internal Network             │ ← Databases, internal services
├─────────────────────────────────────┤
│         Secure Zone                 │ ← Sensitive data, admin systems
└─────────────────────────────────────┘
```

### 2. Firewall Configuration
```bash
# iptables rules
# Allow SSH from specific IP
iptables -A INPUT -p tcp -s 192.168.1.100 --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop all other traffic
iptables -A INPUT -j DROP
```

### 3. VPN and Secure Tunnels
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│   VPN       │───▶│ Internal   │
│   Device    │    │   Gateway   │    │  Network   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Encryption  │    │  Tunneling  │    │   Access    │
│   (IPsec)   │    │   (GRE)     │    │  Control    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Application Security

### 1. Input Validation and Sanitization
```python
import re
from html import escape

def sanitize_input(user_input):
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>]', '', user_input)

    # Escape HTML entities
    sanitized = escape(sanitized)

    # Validate length
    if len(sanitized) > 100:
        raise ValueError("Input too long")

    return sanitized
```

### 2. SQL Injection Prevention
```python
# ❌ Vulnerable to SQL injection
query = f"SELECT * FROM users WHERE username = '{username}'"

# ✅ Safe with parameterized queries
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
```

### 3. XSS (Cross-Site Scripting) Prevention
```javascript
// Server-side: Escape HTML
const escaped = userInput.replace(/[&<>"']/g, (char) => {
  const escapeChars = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '''
  };
  return escapeChars[char];
});

// Client-side: Use textContent instead of innerHTML
element.textContent = userInput; // Safe
// element.innerHTML = userInput; // Dangerous
```

### 4. CSRF (Cross-Site Request Forgery) Protection
```javascript
// Add CSRF token to forms
<form action="/transfer" method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <input type="text" name="amount">
  <button type="submit">Transfer</button>
</form>
```

## Security Monitoring and Incident Response

### 1. Security Information and Event Management (SIEM)
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Logs      │───▶│   SIEM      │───▶│  Analysis   │
│   Events    │    │   System    │    │  & Alerts   │
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                   │                   │
       │                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboards │    │ Correlation │    │  Response   │
│  & Reports  │    │   Rules     │    │   Actions   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Intrusion Detection Systems
```python
# Simple intrusion detection
class IntrusionDetector:
    def __init__(self):
        self.failed_attempts = {}
        self.blocklist = set()

    def check_login_attempt(self, ip, username, success):
        if not success:
            if ip not in self.failed_attempts:
                self.failed_attempts[ip] = 0
            self.failed_attempts[ip] += 1

            # Block IP after 5 failed attempts
            if self.failed_attempts[ip] >= 5:
                self.blocklist.add(ip)
                print(f"Blocked IP: {ip}")

        return ip not in self.blocklist
```

### 3. Log Analysis and Correlation
```python
import re
from collections import defaultdict

class LogAnalyzer:
    def __init__(self):
        self.suspicious_patterns = [
            r'failed login',
            r'sql injection',
            r'cross-site scripting',
            r'unusual traffic'
        ]
        self.ip_attempts = defaultdict(int)

    def analyze_log(self, log_line):
        # Check for suspicious patterns
        for pattern in self.suspicious_patterns:
            if re.search(pattern, log_line, re.IGNORECASE):
                return self._generate_alert(log_line)

        # Check for brute force attempts
        ip_match = re.search(r'(\d+\.\d+\.\d+\.\d+)', log_line)
        if ip_match:
            ip = ip_match.group(1)
            self.ip_attempts[ip] += 1

            if self.ip_attempts[ip] > 10:
                return self._generate_brute_force_alert(ip)

        return None

    def _generate_alert(self, log_line):
        return {
            'type': 'suspicious_activity',
            'message': f'Suspicious activity detected: {log_line}',
            'severity': 'high'
        }
```

## Compliance and Regulatory Requirements

### 1. GDPR (General Data Protection Regulation)
```
Key Requirements:
├── Lawful data processing
├── Data minimization
├── Purpose limitation
├── Accuracy
├── Storage limitation
├── Integrity and confidentiality
├── Accountability
└── Data subject rights
```

### 2. HIPAA (Health Insurance Portability and Accountability Act)
```
Protected Health Information (PHI):
├── Individual identifiers
├── Health information
├── Payment information
├── Security measures
└── Breach notification
```

### 3. PCI DSS (Payment Card Industry Data Security Standard)
```
12 Requirements:
├── Build secure network
├── Protect cardholder data
├── Maintain vulnerability program
├── Implement access controls
├── Monitor and test networks
├── Maintain information security policy
├── Build awareness programs
├── Test security systems
├── Service provider oversight
├── Implement incident response
├── Business continuity
└── Quarterly vulnerability scans
```

## Security Testing

### 1. Penetration Testing Methodology
```
1. Reconnaissance (Information Gathering)
2. Scanning (Vulnerability Identification)
3. Gaining Access (Exploitation)
4. Maintaining Access (Persistence)
5. Analysis & Reporting (Documentation)
```

### 2. Automated Security Testing
```python
# OWASP ZAP API for automated scanning
from zapv2 import ZAPv2

class SecurityScanner:
    def __init__(self, zap_url='http://localhost:8080'):
        self.zap = ZAPv2(apikey='your-api-key', proxies={'http': zap_url, 'https': zap_url})

    def scan_target(self, target_url):
        # Start spidering
        self.zap.spider.scan(target_url)

        # Wait for spidering to complete
        while int(self.zap.spider.status()) < 100:
            time.sleep(1)

        # Start active scanning
        scan_id = self.zap.ascan.scan(target_url)

        # Wait for scanning to complete
        while int(self.zap.ascan.status(scan_id)) < 100:
            time.sleep(5)

        # Get alerts
        alerts = self.zap.core.alerts()
        return self._analyze_alerts(alerts)

    def _analyze_alerts(self, alerts):
        high_risk = []
        medium_risk = []

        for alert in alerts:
            if alert['risk'] == 'High':
                high_risk.append(alert)
            elif alert['risk'] == 'Medium':
                medium_risk.append(alert)

        return {
            'high_risk': high_risk,
            'medium_risk': medium_risk,
            'total_alerts': len(alerts)
        }
```

## Security Best Practices Implementation

### 1. Secure Development Lifecycle (SDL)
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Requirements│───▶│   Design    │───▶│Development │
│  Analysis   │    │             │    │            │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Testing   │    │ Deployment  │    │Monitoring  │
│  & Review   │    │             │    │  & Alert   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Security Headers Implementation
```nginx
# Security headers in Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 3. Secure Coding Guidelines
```python
# Secure password hashing
import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Secure random number generation
import secrets

def generate_secure_token(length=32):
    return secrets.token_urlsafe(length)

# Secure file upload validation
import magic
import os

def validate_file_upload(file_path, allowed_types):
    # Check file type
    mime_type = magic.from_file(file_path, mime=True)
    if mime_type not in allowed_types:
        raise ValueError(f"Invalid file type: {mime_type}")

    # Check file size
    if os.path.getsize(file_path) > 10 * 1024 * 1024:  # 10MB
        raise ValueError("File too large")

    return True
```

## Incident Response Plan

### 1. Incident Response Phases
```
1. Preparation
   ├── Team formation
   ├── Tools and procedures
   ├── Communication plan
   └── Training

2. Identification
   ├── Detection methods
   ├── Alert analysis
   └── Incident classification

3. Containment
   ├── Short-term containment
   ├── System isolation
   └── Evidence preservation

4. Eradication
   ├── Root cause analysis
   ├── Vulnerability removal
   └── System cleaning

5. Recovery
   ├── System restoration
   ├── Monitoring
   └── Validation

6. Lessons Learned
   ├── Incident review
   ├── Process improvement
   └── Documentation update
```

### 2. Communication Strategy
```
Stakeholders to Notify:
├── Internal Teams (IT, Security, Management)
├── External Parties (Customers, Partners, Regulators)
├── Law Enforcement (if criminal activity)
└── Public Relations (for major incidents)

Communication Timeline:
├── Immediate: Internal teams
├── 1 hour: Management and key stakeholders
├── 24 hours: Customers (if affected)
├── As required: Regulators and law enforcement
```

## Security Metrics and KPIs

### 1. Security Metrics
```
┌─────────────────────────────────────┐
│         Security Metrics             │
├─────────────────────────────────────┤
│ • Mean Time To Detect (MTTD)        │
│ • Mean Time To Respond (MTTR)       │
│ • Number of security incidents      │
│ • Percentage of patched systems     │
│ • Failed login attempts             │
│ • Data breach impact                 │
└─────────────────────────────────────┘
```

### 2. Compliance Metrics
```
┌─────────────────────────────────────┐
│       Compliance Metrics            │
├─────────────────────────────────────┤
│ • Audit findings                    │
│ • Policy compliance rate            │
│ • Training completion rate          │
│ • Vulnerability scan results        │
│ • Access review completion          │
└─────────────────────────────────────┘
```

## Summary

Security architecture requires a holistic approach that encompasses:

1. **Defense in Depth**: Multiple security layers
2. **Zero Trust**: Never trust, always verify
3. **Secure Development**: Security throughout SDLC
4. **Monitoring & Response**: Continuous monitoring and incident response
5. **Compliance**: Meeting regulatory requirements
6. **Education**: Security awareness and training

Key principles to remember:
- Security is everyone's responsibility
- Prevention is better than reaction
- Security is a continuous process
- Balance security with usability
- Stay informed about emerging threats

Implementing these security patterns and practices will help build robust, secure systems that protect against modern threats while maintaining performance and usability.