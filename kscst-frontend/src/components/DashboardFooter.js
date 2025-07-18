import { motion } from 'framer-motion';

function DashboardFooter() {
  return (
    <footer className="bg-[var(--primary-blue)] border-t border-[var(--indigo-dark)] mt-auto shadow-sm">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-white font-medium">
          © 2025 KSCST Vocational Training. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-3 md:mt-0">
          {['Privacy', 'Terms', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href="#"
              className="text-sm text-white font-medium hover:text-[var(--accent-blue)] relative group transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[var(--primary-blue)] to-[var(--accent-blue)] group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;