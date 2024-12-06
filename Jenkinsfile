pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {
        //stage('Checkout') {
        //    steps {
        //        checkout scm
        //    }
        //}
        stage('Download project') {
            steps {
                git 'https://github.com/METR1CKA/inventory-app-fullstack.git'
                bash 'npm install'
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
