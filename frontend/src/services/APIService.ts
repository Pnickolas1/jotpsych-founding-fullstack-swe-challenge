interface APIResponse<T> {
  data?: T;
  error?: string;
  version?: string;
  requiresRefresh?: boolean;
}

interface TranscriptionResponse {
  transcription: string;
  category?: string;
}

class APIService {
  private baseUrl: string = "http://localhost:8000";
  private currentVersion: string = "1.0.0";
  private userID: string = "1234567890";
  private versionMismatchDetected: boolean = false;

  constructor() {
    this.setupVersionMismatchListener();
  }

  private setupVersionMismatchListener() {
    const versionMismatchEvent = new CustomEvent("apiVersionMismatch", {
      detail: {
        message: "Backend version has changed. Please refresh your browser.",
      },
    });

    // Add method to trigger the event
    this.triggerVersionMismatch = () => {
      if (!this.versionMismatchDetected) {
        this.versionMismatchDetected = true;
        window.dispatchEvent(versionMismatchEvent);
      }
    };
  }

  public hasVersionMismatch(): boolean {
    return this.versionMismatchDetected;
  }

  private triggerVersionMismatch: () => void = () => {};

  private checkVersion(serverVersion?: string): boolean {
    if (!serverVersion) {
      return true;
    }

    if (serverVersion !== this.currentVersion) {
      console.warn(
        `Version mismatch: Client ${this.currentVersion}, Server ${serverVersion}`
      );
      this.triggerVersionMismatch();
      return false;
    }
    return true;
  }

  // Generic request handler
  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: FormData | object
  ): Promise<APIResponse<T>> {
    if (this.versionMismatchDetected) {
      return {
        error: "Client version outdated. Please refresh your browser.",
        requiresRefresh: true,
      };
    }

    try {
      const headers: HeadersInit = {
        "X-Client-Version": this.currentVersion,
        "X-User-ID": this.userID,
      };

      // Add Content-Type header if body is a plain object (not FormData)
      if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        body: body instanceof FormData ? body : JSON.stringify(body),
      };

      const response = await fetch(
        `${this.baseUrl}${endpoint}`,
        requestOptions
      );
      const data = await response.json();

      const serverVersion =
        response.headers.get("X-Server-Version") || data.version;
      const versionsMatch = this.checkVersion(serverVersion);
      if (!versionsMatch) {
        return {
          data: data,
          version: serverVersion,
          requiresRefresh: true,
        };
      }

      return { data: data, version: serverVersion, requiresRefresh: false };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

  // Updated transcribeAudio using the generic request handler
  async transcribeAudio(audioBlob: Blob): Promise<APIResponse<string>> {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    return this.makeRequest<string>("/transcribe", "POST", formData);
  }

  async checkServerVersion(): Promise<APIResponse<{ version: string }>> {
    return this.makeRequest<{ version: string }>("/version", "GET");
  }
}

export default new APIService();
