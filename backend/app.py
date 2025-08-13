import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

local_json_path = os.path.join(os.path.dirname(__file__), 'command_elements.json')
with open(local_json_path, 'r') as f:
    commands_data = json.load(f)

@app.route('/explain', methods=['POST'])
def explain():
    data = request.json
    command_line = data.get('command', '').strip()
    if not command_line:
        return jsonify({'error': 'No command provided'}), 400

    parts = command_line.split()
    cmd = parts[0]
    flags = parts[1:]

    if cmd not in commands_data:
        return jsonify({
            'description': f"No data available for '{cmd}' command.",
            'flags': [],
            'usage': []
        })

    cmd_info = commands_data[cmd]
    description = cmd_info.get('description', 'No description available.')
    flag_defs = cmd_info.get('flags', {})
    usage_examples = cmd_info.get('usage', [])

    flag_explanations = []
    for flag in flags:
        if flag.startswith('-') and not flag.startswith('--') and len(flag) > 2:
            # Expanded combined short flags like -xz
            for ch in flag[1:]:
                short_flag = '-' + ch
                flag_explanations.append({
                    'flag': short_flag,
                    'explanation': flag_defs.get(short_flag, 'No explanation available.')
                })
        else:
            flag_explanations.append({
                'flag': flag,
                'explanation': flag_defs.get(flag, 'No explanation available.')
            })

    return jsonify({
        'description': description,
        'flags': flag_explanations,
        'usage': usage_examples
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) # Changed port to 5001
