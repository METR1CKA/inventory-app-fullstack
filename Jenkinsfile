pipeline {
    agent any
    environment {
        NODE_VERSION = '20.17.0'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Setup Environment') {
            steps {
                sh '''
                if ! command -v node &> /dev/null; then
                    echo "Node.js no está instalado. Instalando..."
                    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                fi
                echo "Node.js y npm instalados correctamente"
                '''

                sh '''
                if ! command -v psql &> /dev/null; then
                    echo "PostgreSQL no está instalado. Por favor, instálalo antes de continuar."
                    exit 1
                fi
                '''
            }
        }
        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }
        // stage('Run Migrations and Seeds') {
        //     steps {
        //         sh 'npm run pg:ref'
        //     }
        // }
        // stage('Run Tests') {
        //     steps {
        //         sh 'npm test'
        //     }
        // }
        // stage('Deploy') {
        //     steps {
        //         echo 'Deploying application...'
        //         sh 'npm run dev'
        //     }
        // }
    }
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
