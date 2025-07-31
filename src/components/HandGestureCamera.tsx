import { motion } from "framer-motion";
import { Camera, CameraOff, Hand, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOptimizedHandGestureRecognition, GestureType } from "@/hooks/useOptimizedHandGestureRecognition";
import FallbackGestureInterface from "./FallbackGestureInterface";
import GestureErrorBoundary from "./GestureErrorBoundary";
import { useState, useEffect } from "react";

interface HandGestureCameraProps {
  onGestureDetected: (gesture: GestureType) => void;
  isVisible: boolean;
  onClose: () => void;
}

const HandGestureCamera = ({ onGestureDetected, isVisible, onClose }: HandGestureCameraProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const {
    videoRef,
    canvasRef,
    isLoading,
