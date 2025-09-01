# Notification System Design Tutorial

## Overview
This tutorial will guide you through designing a scalable notification system that can handle millions of notifications across multiple channels (email, SMS, push notifications, in-app notifications).

## Step 1: Requirements Analysis

### Functional Requirements
- **Multi-Channel Support**: Email, SMS, Push, In-App notifications
- **Template Management**: Create and manage notification templates
- **User Preferences**: Allow users to customize notification settings
- **Scheduled Notifications**: Send notifications at specific times
- **Bulk Notifications**: Send to large groups of users
- **Delivery Tracking**: Track delivery status and engagement
- **Retry Logic**: Handle failed deliveries with exponential backoff
- **Analytics**: Generate reports on notification performance

### Non-Functional Requirements
- **High Throughput**: Handle 1M+ notifications per hour
- **Low Latency**: < 5 seconds from trigger to delivery
- **High Availability**: 99.99% uptime
- **Scalability**: Auto-scale based on load
- **Reliability**: Guaranteed delivery with retries
- **Security**: Protect user data and prevent spam

### Business Rules
- Users can opt-out of specific notification types
- Notifications must respect user time zones
- Rate limiting per user and per channel
- Compliance with anti-spam regulations (CAN-SPAM, GDPR)

## Step 2: System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────┐
│         Client Applications         │
│  ┌─────────┐ ┌─────┐ ┌─────────────┐ │
│  │ Web App │ │ API │ │ Mobile Apps │ │
│  └─────────┘ └─────┘ └─────────────┘ │
└─────────────────────────────────────┘
                   │
┌─────────────────────────────────────┐
│         API Gateway                 │
│  • Authentication & Authorization   │
│  • Rate Limiting                    │
│  • Request Routing                  │
└─────────────────────────────────────┘
                   │
          ┌────────┼────────┐
          │        │        │
┌─────────┴─┐ ┌────┴─────┐ ┌─┴─────────┐
│Notification│ │Template │ │User       │
│ Service    │ │ Service │ │Management │
│            │ │         │ │ Service   │
│• Queue     │ │• CRUD   │ │• Preferences│
│• Routing   │ │• Version│ │• Settings  │
└───────────┘ └─────────┘ └────────────┘
      │            │            │
┌─────┼────────────┼────────────┼─────┐
│     │            │            │     │
│ ┌───┴───┐   ┌────┴────┐  ┌────┴────┐ │
│ │Kafka │   │PostgreSQL│  │  Redis  │ │
│ │Queue │   │ Templates│  │  Cache  │ │
│ └───────┘   └─────────┘  └─────────┘ │
└─────────────────────────────────────┘
                   │
          ┌────────┼────────┐
          │        │        │
┌─────────┴─┐ ┌────┴─────┐ ┌─┴─────────┐
│  Email    │ │   SMS    │ │   Push    │
│ Provider  │ │ Provider │ │ Provider │
└───────────┘ └──────────┘ └───────────┘
```

### Component Breakdown

#### Notification Service
- Receives notification requests
- Validates and enriches notifications
- Routes to appropriate channels
- Handles queuing and retries

#### Template Service
- Manages notification templates
- Supports variable substitution
- Handles template versioning
- Provides template validation

#### User Management Service
- Manages user preferences
- Handles opt-in/opt-out logic
- Stores delivery addresses
- Manages user segments

#### Channel Providers
- **Email**: SendGrid, Amazon SES, Mailgun
- **SMS**: Twilio, AWS SNS, Nexmo
- **Push**: Firebase, APNs, FCM
- **In-App**: WebSocket connections, database storage

## Step 3: Data Model Design

### Core Tables (PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    channel VARCHAR(20), -- email, sms, push, in_app
    notification_type VARCHAR(50), -- marketing, transactional, system
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, channel, notification_type)
);

-- Notification templates
CREATE TABLE templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    subject TEXT, -- for email
    content TEXT NOT NULL,
    variables JSONB, -- template variables
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    template_id BIGINT REFERENCES templates(id),
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB, -- additional data
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification events (for analytics)
CREATE TABLE notification_events (
    id BIGSERIAL PRIMARY KEY,
    notification_id BIGINT REFERENCES notifications(id),
    event_type VARCHAR(20), -- sent, delivered, opened, clicked, bounced
    event_data JSONB,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance
```sql
-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Indexes for user preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_channel_type ON user_preferences(channel, notification_type);

-- Indexes for events
CREATE INDEX idx_notification_events_notification_id ON notification_events(notification_id);
CREATE INDEX idx_notification_events_type ON notification_events(event_type);
CREATE INDEX idx_notification_events_occurred_at ON notification_events(occurred_at);
```

## Step 4: API Design

### RESTful Endpoints
```http
# Send notification
POST /api/v1/notifications
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": 123,
  "templateName": "welcome_email",
  "channel": "email",
  "variables": {
    "name": "John Doe",
    "activationLink": "https://app.com/activate/abc123"
  },
  "scheduledAt": "2024-01-01T10:00:00Z",  // optional
  "priority": "normal"
}

Response:
{
  "notificationId": "notif_123456",
  "status": "queued",
  "estimatedDelivery": "2024-01-01T10:00:05Z"
}

# Bulk notification
POST /api/v1/notifications/bulk
{
  "userIds": [123, 456, 789],
  "templateName": "product_update",
  "channel": "push",
  "variables": {
    "productName": "New Feature",
    "releaseDate": "2024-01-15"
  }
}

# Get notification status
GET /api/v1/notifications/{notificationId}

Response:
{
  "id": "notif_123456",
  "status": "delivered",
  "deliveredAt": "2024-01-01T10:00:03Z",
  "events": [
    {"type": "sent", "timestamp": "2024-01-01T10:00:01Z"},
    {"type": "delivered", "timestamp": "2024-01-01T10:00:03Z"},
    {"type": "opened", "timestamp": "2024-01-01T10:05:00Z"}
  ]
}

# Update user preferences
PUT /api/v1/users/{userId}/preferences
{
  "email": {
    "marketing": true,
    "transactional": true,
    "system": true
  },
  "sms": {
    "marketing": false,
    "transactional": true,
    "system": true
  }
}
```

## Step 5: Notification Processing Flow

### Asynchronous Processing with Kafka
```python
from kafka import KafkaProducer, KafkaConsumer
import json
from datetime import datetime

class NotificationProcessor:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

    def queue_notification(self, notification_data):
        """Queue notification for processing"""
        message = {
            'notification_id': notification_data['id'],
            'user_id': notification_data['user_id'],
            'template_id': notification_data['template_id'],
            'channel': notification_data['channel'],
            'variables': notification_data['variables'],
            'priority': notification_data.get('priority', 'normal'),
            'created_at': datetime.utcnow().isoformat()
        }

        # Send to appropriate topic based on priority
        topic = f'notifications.{notification_data["channel"]}'
        if notification_data.get('priority') == 'high':
            topic += '.high_priority'

        self.producer.send(topic, message)
        self.producer.flush()

    def process_notifications(self):
        """Process notifications from queue"""
        consumer = KafkaConsumer(
            'notifications.email',
            'notifications.sms',
            'notifications.push',
            bootstrap_servers=['localhost:9092'],
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id='notification_processors'
        )

        for message in consumer:
            notification = message.value
            try:
                self._process_single_notification(notification)
            except Exception as e:
                self._handle_processing_error(notification, str(e))
```

### Template Processing
```python
import jinja2
from typing import Dict, Any

class TemplateProcessor:
    def __init__(self):
        self.env = jinja2.Environment(
            loader=jinja2.BaseLoader(),
            autoescape=True
        )

    def render_template(self, template_content: str, variables: Dict[str, Any]) -> str:
        """Render template with variables"""
        template = self.env.from_string(template_content)
        return template.render(**variables)

    def validate_variables(self, template_content: str, variables: Dict[str, Any]) -> bool:
        """Validate that all required variables are provided"""
        template = self.env.from_string(template_content)
        try:
            # Try to render with provided variables
            template.render(**variables)
            return True
        except jinja2.UndefinedError:
            return False
```

## Step 6: Channel-Specific Implementations

### Email Provider Integration
```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailProvider:
    def __init__(self, smtp_server, smtp_port, username, password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password

    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email using SMTP"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.username
            msg['To'] = to_email

            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            server.sendmail(self.username, to_email, msg.as_string())
            server.quit()

            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
```

### SMS Provider Integration
```python
import requests
from typing import Optional

class SMSProvider:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.twilio.com/2010-04-01"

    def send_sms(self, to_number: str, message: str) -> Optional[str]:
        """Send SMS using Twilio API"""
        try:
            url = f"{self.base_url}/Accounts/{self.api_key}/Messages.json"
            data = {
                'From': '+1234567890',  # Your Twilio number
                'To': to_number,
                'Body': message
            }

            response = requests.post(
                url,
                data=data,
                auth=(self.api_key, self.api_secret)
            )

            if response.status_code == 201:
                return response.json()['sid']  # Message SID
            else:
                print(f"SMS send failed: {response.text}")
                return None
        except Exception as e:
            print(f"SMS send error: {e}")
            return None
```

### Push Notification Provider
```python
import firebase_admin
from firebase_admin import messaging

class PushProvider:
    def __init__(self, credentials_path: str):
        self.app = firebase_admin.initialize_app(
            firebase_admin.credentials.Certificate(credentials_path)
        )

    def send_push_notification(self, token: str, title: str, body: str, data: dict = None) -> bool:
        """Send push notification using Firebase"""
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=token
            )

            response = messaging.send(message)
            print(f"Push notification sent: {response}")
            return True
        except Exception as e:
            print(f"Push notification failed: {e}")
            return False
```

## Step 7: Retry and Error Handling

### Exponential Backoff Strategy
```python
import time
import random
from typing import Callable, Any

class RetryHandler:
    def __init__(self, max_retries: int = 3, base_delay: float = 1.0):
        self.max_retries = max_retries
        self.base_delay = base_delay

    def execute_with_retry(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with exponential backoff retry"""
        last_exception = None

        for attempt in range(self.max_retries + 1):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e

                if attempt < self.max_retries:
                    # Calculate delay with jitter
                    delay = self.base_delay * (2 ** attempt)
                    jitter = random.uniform(0, delay * 0.1)
                    total_delay = delay + jitter

                    print(f"Attempt {attempt + 1} failed, retrying in {total_delay:.2f}s: {e}")
                    time.sleep(total_delay)
                else:
                    print(f"All {self.max_retries + 1} attempts failed")
                    raise last_exception

        raise last_exception
```

### Circuit Breaker Pattern
```python
from enum import Enum
import time

class CircuitBreakerState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitBreakerState.CLOSED

    def call(self, func, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        if self.state == CircuitBreakerState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitBreakerState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e

    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt reset"""
        if self.last_failure_time is None:
            return True
        return time.time() - self.last_failure_time >= self.recovery_timeout

    def _on_success(self):
        """Handle successful call"""
        self.failure_count = 0
        self.state = CircuitBreakerState.CLOSED

    def _on_failure(self):
        """Handle failed call"""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = CircuitBreakerState.OPEN
```

## Step 8: Analytics and Reporting

### Real-Time Analytics
```python
from collections import defaultdict
import time

class NotificationAnalytics:
    def __init__(self):
        self.metrics = defaultdict(int)
        self.channel_metrics = defaultdict(lambda: defaultdict(int))
        self.template_metrics = defaultdict(lambda: defaultdict(int))

    def record_event(self, notification_id: str, event_type: str,
                    channel: str, template_id: str):
        """Record notification event"""
        # Overall metrics
        self.metrics[f'total_{event_type}'] += 1

        # Channel-specific metrics
        self.channel_metrics[channel][f'{event_type}_count'] += 1

        # Template-specific metrics
        self.template_metrics[template_id][f'{event_type}_count'] += 1

        # Calculate rates
        self._update_rates()

    def _update_rates(self):
        """Update delivery rates and other calculated metrics"""
        total_sent = self.metrics.get('total_sent', 0)
        total_delivered = self.metrics.get('total_delivered', 0)

        if total_sent > 0:
            delivery_rate = (total_delivered / total_sent) * 100
            self.metrics['delivery_rate_percent'] = delivery_rate

    def get_metrics_summary(self):
        """Get summary of all metrics"""
        return {
            'overall': dict(self.metrics),
            'by_channel': dict(self.channel_metrics),
            'by_template': dict(self.template_metrics)
        }
```

### Scheduled Reports
```python
import schedule
import time
from datetime import datetime, timedelta

class ReportGenerator:
    def __init__(self, analytics, email_provider):
        self.analytics = analytics
        self.email_provider = email_provider

    def generate_daily_report(self):
        """Generate and send daily notification report"""
        yesterday = datetime.now() - timedelta(days=1)
        date_str = yesterday.strftime('%Y-%m-%d')

        metrics = self.analytics.get_metrics_summary()

        report = f"""
        Daily Notification Report - {date_str}

        Overall Metrics:
        - Total Sent: {metrics['overall'].get('total_sent', 0)}
        - Total Delivered: {metrics['overall'].get('total_delivered', 0)}
        - Delivery Rate: {metrics['overall'].get('delivery_rate_percent', 0):.2f}%

        By Channel:
        {self._format_channel_metrics(metrics['by_channel'])}

        By Template:
        {self._format_template_metrics(metrics['by_template'])}
        """

        # Send report via email
        self.email_provider.send_email(
            to_email="admin@company.com",
            subject=f"Daily Notification Report - {date_str}",
            html_content=f"<pre>{report}</pre>"
        )

    def _format_channel_metrics(self, channel_metrics):
        """Format channel metrics for report"""
        result = ""
        for channel, data in channel_metrics.items():
            result += f"- {channel}: {data.get('sent_count', 0)} sent, "
            result += f"{data.get('delivered_count', 0)} delivered\n"
        return result

    def _format_template_metrics(self, template_metrics):
        """Format template metrics for report"""
        result = ""
        for template_id, data in template_metrics.items():
            result += f"- Template {template_id}: {data.get('sent_count', 0)} sent\n"
        return result

    def start_scheduler(self):
        """Start the report scheduler"""
        schedule.every().day.at("09:00").do(self.generate_daily_report)

        while True:
            schedule.run_pending()
            time.sleep(60)
```

## Step 9: Testing and Quality Assurance

### Unit Testing
```python
import unittest
from unittest.mock import Mock, patch
from notification_service import NotificationService

class TestNotificationService(unittest.TestCase):
    def setUp(self):
        self.service = NotificationService()
        self.mock_template_service = Mock()
        self.mock_user_service = Mock()
        self.service.template_service = self.mock_template_service
        self.service.user_service = self.mock_user_service

    def test_send_notification_success(self):
        """Test successful notification sending"""
        # Arrange
        notification_request = {
            'user_id': 123,
            'template_name': 'welcome_email',
            'channel': 'email',
            'variables': {'name': 'John'}
        }

        self.mock_user_service.get_user_preferences.return_value = {
            'email': {'marketing': True}
        }
        self.mock_template_service.get_template.return_value = {
            'id': 1,
            'content': 'Welcome {{name}}!'
        }

        # Act
        result = self.service.send_notification(notification_request)

        # Assert
        self.assertTrue(result['success'])
        self.assertEqual(result['notification_id'], 'notif_123')

    def test_send_notification_user_opted_out(self):
        """Test notification blocked when user opted out"""
        # Arrange
        notification_request = {
            'user_id': 123,
            'template_name': 'marketing_email',
            'channel': 'email'
        }

        self.mock_user_service.get_user_preferences.return_value = {
            'email': {'marketing': False}
        }

        # Act & Assert
        with self.assertRaises(ValueError) as context:
            self.service.send_notification(notification_request)

        self.assertIn('opted out', str(context.exception))
```

### Load Testing
```python
import locust
from locust import HttpUser, task, between

class NotificationUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def send_notification(self):
        """Send notification task"""
        notification_data = {
            "userId": 123,
            "templateName": "test_notification",
            "channel": "email",
            "variables": {
                "name": "Test User",
                "message": "This is a test notification"
            }
        }

        self.client.post("/api/v1/notifications", json=notification_data)

    @task(1)
    def get_notification_status(self):
        """Check notification status task"""
        self.client.get("/api/v1/notifications/notif_123")

    @task(1)
    def update_preferences(self):
        """Update user preferences task"""
        preferences = {
            "email": {
                "marketing": True,
                "transactional": True
            }
        }

        self.client.put("/api/v1/users/123/preferences", json=preferences)
```

## Step 10: Deployment and Monitoring

### Docker Configuration
```dockerfile
# Dockerfile for Notification Service
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "app.py"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: notification-service
  template:
    metadata:
      labels:
        app: notification-service
    spec:
      containers:
      - name: notification-service
        image: notification-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: KAFKA_BROKERS
          value: "kafka-1:9092,kafka-2:9092"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Monitoring with Prometheus
```yaml
# Prometheus metrics
notifications_sent_total: Counter for total notifications sent
notifications_delivered_total: Counter for delivered notifications
notification_processing_duration: Histogram for processing time
notification_queue_size: Gauge for queue size
channel_failure_rate: Counter for channel failures
```

## Summary

This notification system design covers:

1. **Scalable Architecture**: Microservices with event-driven processing
2. **Multi-Channel Support**: Email, SMS, Push, In-App notifications
3. **Reliability**: Retry logic, circuit breakers, dead letter queues
4. **User Control**: Preferences, opt-in/opt-out, rate limiting
5. **Analytics**: Real-time metrics and reporting
6. **Security**: Authentication, authorization, data protection
7. **Testing**: Unit tests, load testing, integration tests
8. **Deployment**: Containerization, orchestration, monitoring

The system can handle millions of notifications daily while maintaining high delivery rates and user satisfaction. Key success factors include proper queue management, comprehensive error handling, and continuous monitoring.