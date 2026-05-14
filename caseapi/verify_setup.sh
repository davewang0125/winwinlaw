#!/bin/bash
# Verification script for Legal Case Analysis API setup

echo "🔍 Verifying Legal Case Analysis API Setup..."
echo ""

# Check Python version
echo "1. Checking Python version..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "   ✅ $PYTHON_VERSION"
else
    echo "   ❌ Python 3 not found"
    exit 1
fi

# Check virtual environment
echo ""
echo "2. Checking virtual environment..."
if [ -d "venv" ]; then
    echo "   ✅ Virtual environment exists"
else
    echo "   ❌ Virtual environment not found"
    echo "   Run: python3 -m venv venv"
    exit 1
fi

# Check .env file
echo ""
echo "3. Checking .env file..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "OPENAI_API_KEY=sk-" .env; then
        echo "   ✅ OpenAI API key configured"
    else
        echo "   ⚠️  OpenAI API key may not be set correctly"
        echo "   Please edit .env and add your API key"
    fi
else
    echo "   ❌ .env file not found"
    echo "   Run: cp .env.example .env"
    exit 1
fi

# Check dependencies
echo ""
echo "4. Checking dependencies..."
source venv/bin/activate
if python -c "import fastapi" 2>/dev/null; then
    echo "   ✅ FastAPI installed"
else
    echo "   ❌ FastAPI not installed"
    echo "   Run: pip install -r requirements.txt"
    exit 1
fi

if python -c "import openai" 2>/dev/null; then
    echo "   ✅ OpenAI library installed"
else
    echo "   ❌ OpenAI library not installed"
    echo "   Run: pip install -r requirements.txt"
    exit 1
fi

# Check app can load
echo ""
echo "5. Checking app can load..."
if python -c "from app.main import app" 2>/dev/null; then
    echo "   ✅ FastAPI app loads successfully"
else
    echo "   ❌ App failed to load"
    echo "   Check error messages above"
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure your OpenAI API key is set in .env"
echo "   2. Start the server: ./run.sh"
echo "   3. Test the API: python test_api.py"
echo "   4. View docs at: http://localhost:8000/docs"
echo ""
