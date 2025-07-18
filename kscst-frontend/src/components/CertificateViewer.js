"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getTraineeCertificate } from "../services/authService";
import { Award, Download, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function CertificateViewer({ traineeId, traineeName, skill, issuedAt }) {
  const { user, credentials } = useContext(AuthContext);
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (credentials && traineeId) {
      fetchCertificate();
    }
  }, [credentials, traineeId]);

  const fetchCertificate = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getTraineeCertificate(credentials, traineeId);
      setCertificate(data);
    } catch (err) {
      setError(err.message || "Failed to fetch certificate");
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)" },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Certificate</h2>
          <p className="text-gray-600">Download your completion certificate</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading certificate...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Certificate Not Available</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : certificate ? (
        <div className="text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h3>
            <p className="text-gray-600 mb-6">
              You have successfully completed your training program and earned your certificate.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="text-lg font-semibold text-gray-900">{traineeName || user.username}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Skill</p>
                <p className="text-lg font-semibold text-gray-900">{skill || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Issued On</p>
                <p className="text-lg font-semibold text-gray-900">
                  {issuedAt ? new Date(issuedAt).toLocaleDateString() : new Date(certificate.issuedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <motion.a
              href={`http://localhost:8080/api/certificates/${certificate.filePath}`}
              download
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </motion.a>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Certificate Not Available</h3>
            <p className="text-gray-600 mb-6">
              Complete all training materials and maintain good progress to receive your certificate.
            </p>
            <p className="text-sm text-gray-500">Keep learning to unlock your certificate!</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CertificateViewer;