"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, User, AlertCircle, Pill, Phone } from "lucide-react"

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I'm your AI symptom checker. Please describe your symptoms, and I'll try to help you understand what might be causing them and suggest appropriate actions.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      // This is a mock response - in a real app, this would come from an AI service
      let botResponse
      if (input.toLowerCase().includes("headache")) {
        botResponse = {
          role: "bot",
          content:
            "Based on your description of headache, this could be due to several reasons like stress, dehydration, or fatigue. If you're also experiencing fever, it might be a sign of infection. I recommend:\n\n1. Rest and hydration\n2. Over-the-counter pain relievers like paracetamol\n3. If symptoms persist for more than 24 hours or are severe, please consult a doctor.",
        }
      } else if (input.toLowerCase().includes("stomach") || input.toLowerCase().includes("nausea")) {
        botResponse = {
          role: "bot",
          content:
            "Stomach discomfort and nausea could be signs of indigestion, food poisoning, or motion sickness during your train journey. I recommend:\n\n1. Avoid heavy or spicy foods\n2. Stay hydrated with small sips of water\n3. Consider over-the-counter antacids\n\nIf you experience severe pain, persistent vomiting, or notice blood, please seek immediate medical attention.",
        }
      } else {
        botResponse = {
          role: "bot",
          content:
            "Thank you for describing your symptoms. Based on the information provided, it's difficult to make a specific assessment. Would you mind providing more details about your symptoms? Consider mentioning:\n\n- When did they start?\n- Any other symptoms you're experiencing?\n- Any pre-existing medical conditions?\n\nThis will help me provide better guidance.",
        }
      }

      setMessages((prev) => [...prev, botResponse])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Symptom Checker</h1>
        <p className="text-muted-foreground">Describe your symptoms to get preliminary medical guidance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Symptom Checker
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === "bot" ? <Bot className="h-5 w-5 mt-1" /> : <User className="h-5 w-5 mt-1" />}
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        <div className="flex gap-1">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Describe your symptoms..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("I have a headache and feel dizzy")}
                >
                  Headache & Dizziness
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("I have stomach pain and nausea")}
                >
                  Stomach Pain & Nausea
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("I have a fever and body ache")}
                >
                  Fever & Body Ache
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("I'm experiencing motion sickness")}
                >
                  Motion Sickness
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("I have a cough and sore throat")}
                >
                  Cough & Sore Throat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Further Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full flex items-center justify-start">
                <Pill className="mr-2 h-4 w-4" /> Order Medicines
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start">
                <Phone className="mr-2 h-4 w-4" /> Consult Doctor
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-start">
                <AlertCircle className="mr-2 h-4 w-4" /> Emergency Help
              </Button>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">Disclaimer</h3>
                <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80">
                  This AI symptom checker provides general guidance only and is not a substitute for professional
                  medical advice. Always consult a healthcare professional for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

