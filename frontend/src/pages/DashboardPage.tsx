import { useState } from 'react'
import axios from 'axios'
import { AppHeader } from '../components/AppHeader'
import { MPMGraph } from '../components/MPMGraph'
import { useToast } from '../context/ToastContext'
import { analyze } from '../services/api'
import type { MPMResult } from '../types/mpm'
import { downloadAnalysisPdf } from '../utils/pdfReport'
import { toTaskInputs, type TaskDraft } from '../utils/taskDrafts'

const example: TaskDraft[] = [
  { id: 'a', duration: '7', predecessors: '' }, { id: 'b', duration: '7', predecessors: 'a' },
  { id: 'c', duration: '15', predecessors: 'b' }, { id: 'd', duration: '30', predecessors: 'c' },
  { id: 'e', duration: '45', predecessors: 'd' }, { id: 'g', duration: '45', predecessors: 'd' },
]

export function DashboardPage() {
  const [tasks, setTasks] = useState<TaskDraft[]>(example)
  const [result, setResult] = useState<MPMResult | null>(null)
  const [loading, setLoading] = useState(false)
  const notify = useToast()
  const update = (index: number, patch: Partial<TaskDraft>) => setTasks(items => items.map((t, i) => i === index ? { ...t, ...patch } : t))
  const remove = (index: number) => { setTasks(items => items.filter((_, i) => i !== index)); setResult(null) }
  const add = () => {
    const nextIndex = tasks.length
    setTasks(items => [...items, { id: `T${items.length + 1}`, duration: '', predecessors: '' }])
    window.setTimeout(() => document.getElementById(`task-row-${nextIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }
  const calculate = async () => {
    setLoading(true)
    try { setResult(await analyze(toTaskInputs(tasks))); notify('Graphe MPM généré avec succès.', 'success'); window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 80) }
    catch (error) { notify(error instanceof Error && !axios.isAxiosError(error) ? error.message : axios.isAxiosError(error) ? error.response?.data?.detail ?? 'Calcul impossible.' : 'Erreur inattendue.', 'error') }
    finally { setLoading(false) }
  }
  return <div className="workspace"><AppHeader/><main className="workspace-main"><header className="workspace-title"><div><span className="kicker">Espace d’analyse</span><h1>Construire un graphe MPM</h1><p>Renseignez les tâches et leurs contraintes de précédence. Les calculs suivent la méthode des potentiels Métra.</p></div><div className="method-seal"><small>Méthode</small><strong>MPM</strong><span>Analyse réseau</span></div></header>
    <section className="panel input-panel"><div className="section-title"><div><span className="step">01</span><h2>Données du projet</h2><p>Utilisez une virgule pour plusieurs antécédents : <code>A, B, C</code>.</p></div><button className="secondary" onClick={add}>+ Ajouter une tâche</button></div><div className="task-head"><span>Tâche</span><span>Durée</span><span>T.ant. — antécédents séparés par virgules</span><span>Action</span></div>{tasks.map((task, i) => <div className="task-row" id={`task-row-${i}`} key={i}><input aria-label={`Tâche ${i + 1}`} value={task.id} onChange={e => update(i, { id: e.target.value })} placeholder="Ex. A"/><input aria-label={`Durée ${i + 1}`} inputMode="decimal" value={task.duration} onChange={e => update(i, { duration: e.target.value })} placeholder="Ex. 7"/><input aria-label={`Antécédents ${i + 1}`} value={task.predecessors} placeholder="Ex. A, B, C — vide si aucune" onChange={e => update(i, { predecessors: e.target.value })}/><button className="remove" aria-label={`Supprimer ${task.id || `la tâche ${i + 1}`}`} onClick={() => remove(i)}>×</button></div>)}<div className="form-actions"><div className="form-buttons"><button className="primary" disabled={loading || !tasks.length} onClick={calculate}>{loading ? <><span className="spinner"/>Calcul en cours…</> : 'Générer le graphe MPM'}</button><button className="secondary add-bottom" onClick={add}><b>+</b> Ajouter une tâche</button></div><span>{tasks.length} tâche{tasks.length > 1 ? 's' : ''} saisie{tasks.length > 1 ? 's' : ''}</span></div></section>
    {result ? <div id="results" className="results-enter"><div className="result-toolbar"><div><b>Résultats de l’analyse</b><small>Tableau, graphe et conventions sur une seule page.</small></div><div className="export-actions"><button className="print-action" onClick={() => window.print()}><span aria-hidden="true">▣</span>Imprimer</button><button className="pdf-action" onClick={() => { downloadAnalysisPdf(result); notify('Le rapport PDF a été téléchargé.', 'success') }}><span aria-hidden="true">↓</span>Télécharger le PDF</button></div></div><section className="summary"><article><span className="summary-icon">Σ</span><div><small>Durée minimale du projet</small><strong>{result.project_duration}</strong></div></article><article><span className="summary-icon">◆</span><div><small>Tâches critiques</small><strong>{result.critical_tasks.join(', ')}</strong></div></article><article><span className="summary-icon">↗</span><div><small>Chemin{result.critical_paths.length > 1 ? 's' : ''} critique{result.critical_paths.length > 1 ? 's' : ''}</small><strong>{result.critical_paths.map(path => path.join(' → ')).join('  |  ')}</strong></div></article></section>
      <section className="panel"><div className="section-title compact-title"><div><span className="step">02</span><h2>Tableau d’ordonnancement MPM</h2></div><span className="critical-key"><i/>Repère doré : tâche critique</span></div><div className="table-wrap"><table><thead><tr><th>Tâche</th><th>Durée</th><th>T.ant.</th><th>T.suc.</th><th>Début au plus tôt</th><th>Fin au plus tôt</th><th>Début au plus tard</th><th>Fin au plus tard</th><th>Marge totale</th><th>Marge libre</th></tr></thead><tbody>{result.tasks.map(t => <tr key={t.id} className={t.is_critical ? 'critical-row' : ''}><td><span className="task-cell"><i className={t.is_critical ? 'critical-marker' : 'regular-marker'}/><b>{t.id}</b>{t.is_critical && <small>Critique</small>}</span></td><td>{t.duration}</td><td>{t.predecessors.join(', ') || 'Début'}</td><td>{t.successors.join(', ') || 'Fin'}</td><td>{t.earliest_start}</td><td>{t.earliest_finish}</td><td>{t.latest_start}</td><td>{t.latest_finish}</td><td>{t.total_float}</td><td>{t.free_float}</td></tr>)}</tbody></table></div></section>
      <section className="panel graph-panel"><div className="section-title compact-title"><div><span className="step">03</span><h2>Graphe MPM</h2><p>Les arcs rouges et les sommets cerclés de rouge composent le chemin critique. Déverrouillez la disposition pour déplacer les sommets; les flèches les suivront automatiquement.</p></div><div className="graph-key"><span><i className="critical-dot"/>Critique</span><span><i/>Non critique</span></div></div><MPMGraph key={result.nodes.map(node => `${node.id}:${node.earliest}:${node.latest}`).join('|')} result={result}/></section>
      <section className="panel glossary"><div className="section-title compact-title"><div><span className="step">04</span><h2>Légendes et conventions</h2><p>Notations utilisées dans le tableau et dans les sommets du graphe.</p></div></div><div className="glossary-grid"><dl><dt>T.ant.</dt><dd>Tâche(s) antérieure(s) ou antécédente(s).</dd></dl><dl><dt>T.suc.</dt><dd>Tâche(s) successive(s).</dd></dl><dl><dt>Début au plus tôt</dt><dd>Première date possible de commencement.</dd></dl><dl><dt>Fin au plus tôt</dt><dd>Début au plus tôt + durée.</dd></dl><dl><dt>Début au plus tard</dt><dd>Dernière date de début sans retarder le projet.</dd></dl><dl><dt>Fin au plus tard</dt><dd>Début au plus tard + durée.</dd></dl><dl><dt>MT</dt><dd>Marge totale : retard maximal sans retarder le projet.</dd></dl><dl><dt>ML</dt><dd>Marge libre : retard sans décaler le début tôt d’un successeur.</dd></dl><dl><dt>Arc i → j</dt><dd>La tâche j ne commence qu’après la fin de i.</dd></dl><dl><dt>Chemin critique</dt><dd>Suite de tâches de marge totale nulle.</dd></dl></div></section></div> : <section className="empty-result"><span>◇</span><h2>Votre analyse apparaîtra ici</h2><p>Complétez les tâches puis lancez la génération du graphe MPM.</p></section>}
    </main><footer className="footer">MPM Pilot · Recherche opérationnelle · Méthode des Potentiels Métra</footer></div>
}
