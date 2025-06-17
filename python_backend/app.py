# api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from main import MedicalAIOrchestrator
from config import Config
import logging

app = Flask(__name__)

# Configure CORS with specific settings
CORS(app, 
     resources={r"/api/*": {
         "origins": ["http://localhost:5173"],  # Vite's default port
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "expose_headers": ["Content-Type", "Authorization"]
     }},
     supports_credentials=True)

# Initialize the AI Orchestrator
config = Config()
ai_orchestrator = MedicalAIOrchestrator(config)

@app.route('/api/prescription/generate', methods=['POST'])
async def generate_prescription():
    try:
        data = request.json
        patient_id = data.get('patientId')
        symptoms = data.get('symptoms', [])
        medicines = data.get('medicines', [])
        notes = data.get('notes', '')
        
        # Get patient history from your database (implement this)
        patient_history = "Patient history will be fetched from database"  # TODO: Implement
        
        # Process with AI
        prescription_data = await ai_orchestrator.process_patient_case(
            medical_report_text=patient_history,
            current_symptoms=symptoms
        )
        
        # Add the prescribed medicines
        prescription_data['prescribed_medicines'] = medicines
        prescription_data['notes'] = notes
        
        return jsonify({
            'success': True,
            'prescription': prescription_data
        })
    except Exception as e:
        logging.error(f"Error generating prescription: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/prescription/patient/<patient_id>', methods=['GET'])
def get_patient_prescriptions(patient_id):
    try:
        # TODO: Implement fetching prescriptions from database
        return jsonify({
            'success': True,
            'prescriptions': []
        })
    except Exception as e:
        logging.error(f"Error fetching prescriptions: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/prescription/pdf/<prescription_id>', methods=['GET'])
def generate_prescription_pdf(prescription_id):
    try:
        # TODO: Implement PDF generation
        return jsonify({
            'success': True,
            'message': 'PDF generation not implemented yet'
        })
    except Exception as e:
        logging.error(f"Error generating PDF: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)