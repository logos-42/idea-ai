
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface SpeechInputProps {
  onSpeechInput: (text: string) => void;
  currentText?: string;
}

export function SpeechInput({ onSpeechInput, currentText = "" }: SpeechInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editableText, setEditableText] = useState("");
  const { toast } = useToast();
  
  // 检查浏览器是否支持语音识别
  const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  const startRecording = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "不支持语音识别",
        description: "您的浏览器不支持语音识别功能。",
        variant: "destructive",
      });
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN'; // 设置中文识别
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript("");
      toast({
        title: "开始录音",
        description: "请开始说话...",
      });
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };
    
    recognition.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      setIsRecording(false);
      toast({
        title: "识别错误",
        description: `发生错误: ${event.error}`,
        variant: "destructive",
      });
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      if (transcript) {
        setEditableText(transcript);
        setIsDialogOpen(true);
      }
    };
    
    recognition.start();
    
    // 存储 recognition 实例以便后续停止
    window.currentRecognition = recognition;
  };
  
  const stopRecording = () => {
    if (window.currentRecognition) {
      window.currentRecognition.stop();
    }
  };
  
  const handleEdit = () => {
    if (currentText) {
      setEditableText(currentText);
      setIsDialogOpen(true);
    } else {
      toast({
        title: "无内容可编辑",
        description: "当前没有文本内容可以编辑。",
      });
    }
  };
  
  const handleSave = () => {
    onSpeechInput(editableText);
    setIsDialogOpen(false);
    toast({
      title: "内容已保存",
      description: "语音识别内容已保存。",
    });
  };
  
  return (
    <>
      <div className="flex gap-1">
        {isSpeechRecognitionSupported && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? "bg-red-100 text-red-600 border-red-300" : ""}
            title={isRecording ? "停止录音" : "开始语音输入"}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleEdit}
          title="编辑文本"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑文本</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="min-h-[150px]"
              placeholder="编辑识别的文本..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
