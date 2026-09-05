import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../context/AuthContext'

const rotatingWords = ['maîtrisé.', 'visualisé.', 'optimisé.', 'présentable.']

export function LandingPage() {
  const { user } = useAuth()
  const [wordIndex, setWordIndex] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setWordIndex(index => (index + 1) % rotatingWords.length), 2400)
    return () => window.clearInterval(timer)
  }, [])
  const workspace = user ? '/app' : '/inscription'
  return <div className="landing">
    <nav className="public-nav"><Brand/><div className="public-links"><a href="#fonctionnalites">Fonctionnalités</a><a href="#methode">Méthode MPM</a>{!user && <Link to="/connexion" className="text-link">Connexion</Link>}<Link to={workspace} className="button compact">{user ? 'Ouvrir mon espace' : 'Créer un compte'}</Link></div></nav>

    <main className="hero">
      <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
      <section className="hero-copy"><span className="kicker">Méthode des Potentiels Métra</span><h1>Du tableau des tâches à un projet <span key={wordIndex} className="rotating-word">{rotatingWords[wordIndex]}</span></h1><p>Transformez vos tâches, durées et contraintes en un ordonnancement lisible. MPM Pilot calcule automatiquement les dates, les marges et tous les chemins critiques.</p><div className="hero-actions"><Link to={workspace} className="button">{user ? 'Continuer mon analyse' : 'Commencer gratuitement'}</Link><a href="#methode" className="button ghost">Découvrir la méthode</a></div><div className="trust-row"><span>Calcul transparent</span><span>Graphe interactif</span><span>Résultat imprimable</span></div></section>
      <div className="hero-visual" aria-label="Aperçu animé d’un graphe MPM"><div className="visual-status"><i/>Analyse terminée</div><div className="mini-flow"><div className="mini-node start">Début</div><i/><div className="mini-node"><b>0 | 0</b>A<small>5 j</small></div><i/><div className="mini-node critical"><b>5 | 5</b>B<small>3 j</small></div><i/><div className="mini-node finish">Fin</div></div><span className="mini-margin">MT 0</span><div className="visual-caption"><span><b>8</b> Durée minimale</span><span><b>A → B</b> Chemin critique</span></div></div>
    </main>

    <section className="landing-metrics" aria-label="Avantages"><div><strong>100 %</strong><span>méthode MPM</span></div><div><strong>Automatique</strong><span>dates et marges</span></div><div><strong>Multi-antécédents</strong><span>A, B, C en une saisie</span></div><div><strong>Instantané</strong><span>tableau et graphe</span></div></section>

    <section id="fonctionnalites" className="landing-section"><div className="section-intro"><span className="kicker">Un parcours simple</span><h2>De la saisie à la décision, sans calcul manuel</h2><p>Chaque résultat reste vérifiable dans le tableau et immédiatement visible dans le réseau.</p></div><div className="feature-cards"><article><span>01</span><div className="feature-icon">T</div><h3>Saisissez vos tâches</h3><p>Ajoutez les durées et plusieurs antécédents avec une simple virgule.</p></article><article><span>02</span><div className="feature-icon">Σ</div><h3>Lancez le calcul</h3><p>Les passes avant et arrière déterminent les dates et les marges.</p></article><article><span>03</span><div className="feature-icon">↗</div><h3>Analysez le réseau</h3><p>Les sommets et arcs critiques ressortent dans un graphe interactif.</p></article></div></section>

    <section id="methode" className="method-showcase"><div className="method-copy"><span className="kicker light">Rigueur opérationnelle</span><h2>Une lecture fidèle de votre réseau de tâches</h2><p>Dans MPM, une tâche est portée par un sommet et chaque contrainte de précédence devient un arc. Les calculs sont présentés avec leur vocabulaire complet.</p><ul><li>Dates de début et de fin au plus tôt</li><li>Dates de début et de fin au plus tard</li><li>Marges totale et libre</li><li>Chemins critiques multiples</li></ul><Link to={workspace} className="button light-button">Créer mon premier graphe</Link></div><div className="formula-card"><div><small>PASSAGE AVANT</small><strong>tôt(j)</strong><code>max[tôt(i) + durée(i)]</code></div><div><small>PASSAGE ARRIÈRE</small><strong>tard(i)</strong><code>min[tard(j) − durée(i)]</code></div><div><small>MARGE TOTALE</small><strong>MT(i)</strong><code>tard(i) − tôt(i)</code></div></div></section>

    <section className="landing-section professional-grid"><div><span className="kicker">Pensé pour vos présentations</span><h2>Un résultat clair, du contrôle à la soutenance</h2></div><div className="professional-list"><article><b>Tableau explicite</b><p>T.ant., T.suc., dates et marges réunis sans ambiguïté.</p></article><article><b>Compte personnel</b><p>Accès protégé, identité visible et déconnexion immédiate.</p></article><article><b>Export PDF</b><p>Imprimez l’analyse complète dans une mise en page propre.</p></article><article><b>Interface adaptative</b><p>Utilisable sur ordinateur, tablette et écran mobile.</p></article></div></section>

    <section className="landing-cta"><div><span className="kicker light">Prêt à commencer ?</span><h2>Construisez votre prochain ordonnancement MPM.</h2><p>Créez votre compte et obtenez votre graphe en quelques minutes.</p></div><Link to={workspace} className="button light-button">{user ? 'Accéder à mon espace' : 'Créer un compte'}</Link></section>

    <footer className="landing-footer"><Brand/><p>Application d’ordonnancement par la méthode des Potentiels Métra.</p><div><a href="#fonctionnalites">Fonctionnalités</a><a href="#methode">Méthode</a><Link to="/connexion">Connexion</Link></div></footer>
  </div>
}
